import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Button, TextField, MenuItem, Typography, Grid, Alert } from '@mui/material';

import { signup } from '../actions/AuthAction/signup';

const AddUser = () => {
    const dispatch = useDispatch();
    const { error, success, status } = useSelector((state) => state.Signup);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        role: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const resetFormFields = () => {
        setFormData({
            first_name: '',
            last_name: '',
            role: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    useEffect(() => {
        if (status && status === 'success') {
            resetFormFields();
        }
    }, [status]);

    useEffect(() => {
        if (error) {
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 5000);
        }
    }, [error]);

    useEffect(() => {
        if (success === true) {
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);
        }
    }, [success]);

    const roles = ['super-admin', 'user'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name) {
            newErrors.first_name = 'First name is required.';
        }
        
        if (!formData.last_name) {
            newErrors.last_name = 'Last name is required.';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required.';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        dispatch(signup(formData));
    };

    const handleCancel = () => {
        resetFormFields();
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Add User
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.role}
                            helperText={errors.role}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <Button variant="contained" color="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Box>
            </form>
            {showErrorAlert && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
            {showSuccessAlert && <Alert severity="success" sx={{ marginTop: 2 }}>User Added Successfully!</Alert>}
        </Box>
    );
};

export default AddUser;
