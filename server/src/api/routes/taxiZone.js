const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const Bull = require('bull');
const fs = require('fs');
const csv = require('csv-parser');
const Sequelize = require('sequelize');
const redis = require('redis');

const { Op } = Sequelize;

const {
  successResponseGenerator,
} = require('../../utils');

const appResponse = require('../../utils/app-response');
const { TaxiTrip }  = require('../../db/models');
const socketIO = require('socket.io');
const http = require('http');

const upload = multer({ dest: 'uploads/' });

const server = http.createServer(app)
const io =socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

const csvQueue = new Bull('csvUploadQueue');

const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

redisClient.on('error', (err) => console.log('Redis Client Error', err));


// Monitor queue events
csvQueue.on('completed', (job) => {
  console.log(`Job ${job.id} Completed!`);
  io.emit('jobCompleted', { jobId: job.id });
});

csvQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed: ${err}`);
  io.emit('jobFailed', { jobId: job.id, error: err });
});

// Job processing function
csvQueue.process(async (job) => {
  var results = [];
  let rowsProcessed = 0;
  let totalRows = 0;

  fs.createReadStream(job.data.filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          // ...data,
          // id: uuidv4(),
          user_id: '3fded512-00cd-4171-96bb-8daf22b8f98d',
          vendor_id: data.VendorID,
          tpep_pickup_datetime: new Date(data.tpep_pickup_datetime),
          tpep_dropoff_datetime: new Date(data.tpep_dropoff_datetime),
          passenger_count: +data.passenger_count,
          trip_distance: data.trip_distance,
          ratecode_id: data.RatecodeID,
          store_and_fwd_flag: data.store_and_fwd_flag,
          pu_location_id: data.PULocationID,
          do_location_id: data.DOLocationID,
          payment_type: data.payment_type,
          fare_amount: parseFloat(data.fare_amount),
          extra: data.extra,
          mta_tax: data.mta_tax,
          tip_amount: data.tip_amount,
          tolls_amount: data.tolls_amount,
          improvement_surcharge: data.improvement_surcharge,
          total_amount: data.total_amount,
          congestion_surcharge: data.congestion_surcharge,
          airport_fee: data.Airport_fee
        });
        rowsProcessed++;
      })
      .on('end', async () => {
          // Process and store the data in PostgreSQL
          try {
              const BATCH_SIZE = 200000;
                for (let i = 0; i < results.length; i+= BATCH_SIZE) {
                  const batch = results.slice(i, i + BATCH_SIZE);
                  try {
                    await TaxiTrip.bulkCreate(batch)
                    .then(() => {
                    })
                    .catch((error) => {
                      console.error("Error in bulk creation:", error);
                      throw new Error(error);
                    });

                  } catch (error) {
                    console.error('Error inserting batch:', error);
                    throw new Error(error);
                  }
                }
          } catch (error) {
              throw new Error('Database storage error');
          } finally {
              fs.unlinkSync(job.data.filePath);
          }
      });
});

/**
 * @description Used to upload csv files;
 * @param {String} password
 */
router.post('/upload',
  // PASSWORD_CHECK,
  // validateRequest,
  // passport.authenticate('jwt', { session: false }),
  // rbac.allowedRoles([ROLES.SUPER_ADMIN]),
  upload.single('file'),
  async (req, res, next) => {
    try {
      console.log(req.file)
      let file = req.file;

      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      if (file.mimetype !== 'text/csv') {
        return res.status(400).send("Invalid file format. Please upload a CSV file.");
      }

      const jobId = csvQueue.add({ filePath: file.path})

      res.status(202).json(successResponseGenerator( {jobs:jobId},'File is being processed' ));

      io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
      });

    } catch (error) {
      return res.status(500).json(createResponse({
        returnCode: 1,
        errorCode: 'SYSTEM_ERROR',
        errorMessage: error.sqlMessage || error.message,
        errorMeta: error.stack
    }));
   }
});

// Fetching datasets with filtering and pagination
router.get('/get', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate = null,
      endDate = null,
      passengerCount = null,
      fareAmount = null,
    } = req.query;

    const whereClause = {};
    if (passengerCount) {
      whereClause.passenger_count = passengerCount;
    }
    if (fareAmount) {
      whereClause.fare_amount = { [Op.gte]: fareAmount }; // Greater than or equal to
    }

    if (startDate) {
      whereClause.tpep_pickup_datetime = { [Op.gte]: new Date(startDate) };
    }
    
    if (endDate) {
      whereClause.tpep_dropoff_datetime = { [Op.lte]: new Date(endDate) };
    }

    const { count, rows } = await TaxiTrip.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
    });

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      data: rows,
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API to fetch a dataset by ID
app.get('/:id', async (req, res) => {
  try {
    const dataset = await TaxiTrip.findByPk(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (error) {
    console.error('Error fetching dataset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to update an existing dataset
app.put('/update/:id', async (req, res) => {
  try {
    const dataset = await TaxiTrip.findByPk(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    await TaxiTrip.update(req.body);
    res.json(dataset);
  } catch (error) {
    console.error('Error updating dataset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const dataset = await TaxiTrip.findByPk(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    await dataset.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting dataset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/test',async(req,res) => {
  try {
    await TaxiTrip.create(
      {
        // id: uuidv4(),
        user_id: '577b55a1-0704-4270-af47-729512f49033',
        vendor_id: '2',
        tpep_pickup_datetime: '2024-02-01 00:28:54.000000',
        tpep_dropoff_datetime: '2024-02-01 00:29:18.000000',
        passenger_count: '1',
        trip_distance: '0',
        ratecode_id: '5',
        store_and_fwd_flag: 'N',
        pu_location_id: '48',
        do_location_id: '48',
        payment_type: '1',
        fare_amount: '19.99',
        extra: '0',
        mta_tax: '0',
        tip_amount: '0',
        tolls_amount: '0',
        improvement_surcharge: '1',
        total_amount: '23.49',
        congestion_surcharge: '2.5',
        airport_fee: '0'
      },
    )
    
    res.status(200).send('success')
  } catch (error) {
    res.status(400).json(error)
  }
})


router.get('/trips/aggregate', async (req, res) => {
  let { startDate = null, endDate = null, groupBy = 'day' } = req.query;

  // Generate the cache key based on the request parameters
  let cacheKey = 'aggregatedData';

  if (startDate) {
    startDate = new Date(startDate);
    cacheKey += `:startDate=${startDate.toISOString()}`;
  }

  if (endDate) {
    endDate = new Date(endDate);
    cacheKey += `:endDate=${endDate.toISOString()}`;
  }

  cacheKey += `:groupBy=${groupBy}`;

  // Determine date truncation based on groupBy parameter
  let dateGroup;
  switch (groupBy) {
    case 'month':
      dateGroup = Sequelize.fn('DATE_TRUNC', 'month', Sequelize.cast(Sequelize.col('tpep_pickup_datetime'), 'timestamp'));
      break;
    case 'week':
      dateGroup = Sequelize.fn('DATE_TRUNC', 'week', Sequelize.cast(Sequelize.col('tpep_pickup_datetime'), 'timestamp'));
      break;
    case 'day':
      dateGroup = Sequelize.fn('DATE_TRUNC', 'day', Sequelize.cast(Sequelize.col('tpep_pickup_datetime'), 'timestamp'));
      break;
    default:
      dateGroup = Sequelize.fn('DATE_TRUNC', 'year', Sequelize.cast(Sequelize.col('tpep_pickup_datetime'), 'timestamp'));
  }

  try {
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData)); // Send cached response
    }

    if (!startDate && !endDate) {
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, 0, 1); 
      endDate = new Date(currentYear, 11, 31);
    }

    // Query the data
    const data = await TaxiTrip.findAll({
      attributes: [
        [dateGroup, 'time_period'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_trips'],
        [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('fare_amount'), 'FLOAT')), 'average_fare']
      ],
      where: {
        tpep_pickup_datetime: {
          [Op.between]: [startDate, endDate]
        },
      },
      group: ['time_period'],
      order: [[Sequelize.col('time_period'), 'ASC']]
    });

    // If the data is empty, attempt to fetch the current year's data as a fallback
    if (data.length === 0) {
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31);

      const fallbackData = await TaxiTrip.findAll({
        attributes: [
          [dateGroup, 'time_period'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_trips'],
          [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('fare_amount'), 'FLOAT')), 'average_fare']
        ],
        where: {
          tpep_pickup_datetime: {
            [Op.between]: [startDate, endDate]
          },
        },
        group: ['time_period'],
        order: [[Sequelize.col('time_period'), 'ASC']]
      });

      // Cache the fallback data and respond with it
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(fallbackData));
      return res.json(fallbackData);
    }

    // Cache and return the main data
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
    res.json(data);

  } catch (error) {
    console.error('Error fetching aggregated data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});



 function createResponse(info) {
  return appResponse.createResponse({
      data: info.data,
      returnCode: info.returnCode || 0,
      error: {
          message: info.errorMessage,
          code: info.errorCode,
          meta: info.errorMeta
      }
  });
}

module.exports = router;