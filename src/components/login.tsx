import React from 'react';

export const description =
  "A simple login form with email and password. The submit button says 'Sign in'.";

  const Login: React.FC = () => {
  return (
    <div className="w-full max-w-sm m-auto bg-white shadow-md rounded-lg h-min">
      <div className="p-6 border-b">
        <h2 className="text-2xl text-center font-bold">Login</h2>
        <p className="text-gray-600 mt-2">
          Enter your email below to login to your account.
        </p>
      </div>
      <form className="p-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder='Enter your password'
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
