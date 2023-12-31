import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
// import {useCookies} from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { updateuser } from '../redux/slices/userdata';

import { Cookies, useCookies } from 'react-cookie';
import jwt from 'jwt-decode'


type Inputs = {
  email: string,
  password: string,
};

export default function Signin() {
  // const [cookies, setCookie, removeCookie] = useCookies();
  const [cookies, setCookie, removeCookie] = useCookies(['jwt_token']);
  let navigate = useNavigate();
  const currUser = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

      try {

        const res = await fetch('https://mydemy.onrender.com/signin', {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json',
          },
          body: JSON.stringify(data)
        })
        const result = await res.json();

        console.log(result);

        if (result.authenticated === false) {
          alert('invalid credentials!');
        }
        else if (result.authenticated === true) {

          setCookie("jwt_token", result.token);
          alert('login success!');
          dispatch(updateuser((cookies && cookies.jwt_token && jwt(cookies.jwt_token)) ? jwt(cookies.jwt_token) : ''))
          console.log('after sign in  dispatch ', cookies && cookies.jwt_token && jwt(cookies.jwt_token) ? jwt(cookies.jwt_token) : 'not value till yet')
          navigate('/');
          window.location.reload();
        }
        else if(result.message == "Required email and password."){
          alert("Required email and password.")
        }
        else if(result.message == "This email id is not exist. Please sign up first."){
          alert("This email id is not exist. Please sign up first.")
        }

      } catch (error) {
        console.log('error,not fetched!', error);
      }

  }

  return (
    <div className="container w-25 mt-3">
      <form method="POST" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            {...register("email")}
            type="text"
            className="form-control"
            id="floatingEmail"
            placeholder="Email"
          />
          <label htmlFor="floatingEmail">Email</label>
        </div>

        <div className="form-floating mb-3">
          <input
            {...register("password")}
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        {errors.password && <span>This field is required</span>}

        <div className="form-floating mt-5 mb-2 register-btn">
          <input className="d-flex w-100 justify-content-center py-3" type="submit" value="Log in" />
        </div>
        <div className="signup">
          Dont have an account?
          <NavLink to="/signup" className="text-decoration-none">
            <span> Sign up</span>
          </NavLink>
        </div>
      </form>
    </div>
  );
}