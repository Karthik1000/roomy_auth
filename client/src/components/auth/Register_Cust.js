import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register_cust } from '../../actions/auth';
import PropTypes from 'prop-types';
import "./register_cust.css";
const Register_Cust = ({ setAlert, register_cust, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register_cust({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <Fragment className="bg-mypale">
      
        <h1 className='large text-primary'>Customer Sign Up</h1>
      
      <div className='myborder'>
        <div className="subhead">
           <p className='lead'>
          
            <i className='fas fa-user'></i> Create Your Account
            
          </p>
          </div>
          <form className='form' onSubmit={e => onSubmit(e)}>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Name'
                name='name'
                value={name}
                onChange={e => onChange(e)}
              />
            </div>
            <div className='form-group'>
              <input
                type='email'
                placeholder='Email Address'
                name='email'
                value={email}
                onChange={e => onChange(e)}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password'
                value={password}
                onChange={e => onChange(e)}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Confirm Password'
                name='password2'
                value={password2}
                onChange={e => onChange(e)}
              />
            </div>
            <input type='submit' className='btn btn-primary' value='Customer Register' />
          </form>
        </div>
      <p className='my-1'>
        Already have an account? <Link to='/login_cust'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register_Cust.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register_cust: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register_cust }
)(Register_Cust);
