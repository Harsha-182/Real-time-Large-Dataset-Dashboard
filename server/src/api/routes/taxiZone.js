const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const Bull = require('bull');
const fs = require('fs');
const csv = require('csv-parser');
const { Server } = require('socket.io');
const http = require('http')
const { v4: uuidv4 } = require('uuid');

const {
  successResponseGenerator,
  httpErrorGenerator,
  authUtils,
  mailUtils,
} = require('../../utils');

const appResponse = require('../../utils/app-response');

// const {
//   passport
// } = require('../middlewares');

// const {
//   validator: {
//     checks: {
//       CREDENTIALS,
//       SIGNUP_CHECK,
//       EMAIL_CHECK,
//       PASSWORD_CHECK,
//     },
//     validateRequest,
//   },
// } = require('../middlewares');

// const {
//   HTTP_ERROR_MESSAGES,
//   HTTP_SUCCESS_MESSAGES
// } = require('../constants/messages');

// const { PASSWORD_RESET_MAIL } = require('../constants/mail');
const { TaxiTrip }  = require('../../db/models');
const { rbac } = require('../middlewares');
const { ROLES } = require('../constants')

const upload = multer({ dest: 'uploads/' });

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


// Set up a Bull queue for processing CSV uploads
const csvQueue = new Bull('csvUploadQueue');

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

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

  
  // total row count for calculating progress
  // await new Promise((resolve) => {
  //   fs.createReadStream(job.data.filePath)
  //     .pipe(csv())
  //     .on('data', () => totalRows++)
  //     .on('end', resolve);
  // });

  // console.log("totalRows======",totalRows)

  fs.createReadStream(job.data.filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          // ...data,
          // id: uuidv4(),
          user_id: '577b55a1-0704-4270-af47-729512f49033',
          vendor_id: data.VendorID,
          tpep_pickup_datetime: data.tpep_pickup_datetime? data.tpep_pickup_datetime:'',
          tpep_dropoff_datetime: data.tpep_dropoff_datetime? data.tpep_dropoff_datetime:'',
          passenger_count: data.passenger_count? data.passenger_count:'',
          trip_distance: data.trip_distance? data.trip_distance:'',
          ratecode_id: data.RatecodeID? data.RatecodeID:'',
          store_and_fwd_flag: data.store_and_fwd_flag? data.store_and_fwd_flag:'',
          pu_location_id: data.PULocationID? data.PULocationID:'',
          do_location_id: data.DOLocationID? data.DOLocationID:'',
          payment_type: data.payment_type? data.payment_type:'',
          fare_amount: data.fare_amount? data.fare_amount:'',
          extra: data.extra? data.extra:'',
          mta_tax: data.mta_tax? data.mta_tax:'',
          tip_amount: data.tip_amount? data.tip_amount:'',
          tolls_amount: data.tolls_amount? data.tolls_amount:'',
          improvement_surcharge: data.improvement_surcharge? data.improvement_surcharge:'',
          total_amount: data.total_amount? data.total_amount:'',
          congestion_surcharge: data.congestion_surcharge? data.congestion_surcharge:'',
          airport_fee: data.Airport_fee? data.Airport_fee:''
        });
        rowsProcessed++;

        // const progress = Math.round((rowsProcessed / totalRows) * 100);
        // io.to(job.id).emit('processingProgress', { jobId: job.id, progress });
        // console.log(`Progress for job ${job.id}: ${progress}%`);
      })
      .on('end', async () => {
          // Process and store the data in PostgreSQL
          try {
              // await IceCreamFavorites.bulkCreate(results);
              // await TaxiTrip.bulkCreate(results);
              console.log(results)
              //Batch processing
              // await TaxiTrip.create(results[2]);

              const BATCH_SIZE = 200000;
              console.log("Bulk Creation started")
              // // async function insertTripsInBatches(tripsData) {
                for (let i = 0; i < results.length; i+= BATCH_SIZE) {
                  const batch = results.slice(i, i + BATCH_SIZE);
                  try {
                    // await TaxiTrip.create(results[i]);
                    await TaxiTrip.bulkCreate(batch)
                    .then(() => {
                      // console.log("Trips have been added successfully!");
                    })
                    .catch((error) => {
                      console.error("Error in bulk creation:", error);
                    });

                    console.log(`Inserted batch ${i}`);
                  } catch (error) {
                    console.error('Error inserting batch:', error);
                  }
                }
              // }

            //   console.log(`Processed ${results} records`);
            //   return res.status(200).json(results)
          } catch (error) {
              console.error('Error storing data:', error);
              throw new Error('Database storage error');
            //   return res.status(500).json(createResponse({
            //     returnCode: 1,
            //     errorCode: 'SYSTEM_ERROR',
            //     errorMessage: error.sqlMessage || error.message,
            //     errorMeta: error.stack
            // }));
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

      // const jobs = req.files.map(file => csvQueue.add({ filePath: file.path}));
      // const jobIds = await Promise.all(jobs);

      const jobId = csvQueue.add({ filePath: file.path})

      res.status(202).json(successResponseGenerator( {jobs:jobId},'File is being processed' ));

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
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const whereClause = {};
    if (filters.passenger_count) {
      whereClause.passenger_count = filters.passenger_count;
    }
    if (filters.fare_amount) {
      whereClause.fare_amount = { [Op.gte]: filters.fare_amount }; // Greater than or equal to
    }
    // Add more filters as needed

    // Fetch data with pagination and filtering
    const { count, rows } = await TaxiTrip.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
    });

    // Respond with data and metadata
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
    // broadcast([dataset]); // Broadcast the updated dataset to all clients
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
    // Optionally broadcast the deletion
    // broadcast([{ id: req.params.id }]); // Broadcast the deletion
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