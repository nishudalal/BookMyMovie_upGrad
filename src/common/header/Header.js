import React, { Component } from "react";
import "./Header.css";
import Button from "@material-ui/core/Button";
import logo from "../../assets/logo.svg";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import PropTypes from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link } from "react-router-dom";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Header extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      value: 0,
      usernameRequired: "dispNone",
      username: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      firstnameRequired: "dispNone",
      firstname: "",
      lastnameRequired: "dispNone",
      lastname: "",
      emailRequired: "dispNone",
      email: "",
      registerPasswordRequired: "dispNone",
      registerPassword: "",
      contactRequired: "dispNone",
      contact: "",
      registrationSuccess: false,
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
    };
  }

  onModalOpen = () => {
    this.setState({
      modalOpen: true,
      value: 0,
      usernameRequired: "dispNone",
      username: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      firstnameRequired: "dispNone",
      firstname: "",
      lastnameRequired: "dispNone",
      lastname: "",
      emailRequired: "dispNone",
      email: "",
      registerPasswordRequired: "dispNone",
      registerPassword: "",
      contactRequired: "dispNone",
      contact: "",
    });
  };

  onModalClose = () => {
    this.setState({ modalOpen: false });
  };

  onTabChange = (event, value) => {
    this.setState({ value });
  };

  onLoginClick = () => {
    this.state.username === ""
      ? this.setState({ usernameRequired: "dispBlock" })
      : this.setState({ usernameRequired: "dispNone" });
    this.state.loginPassword === ""
      ? this.setState({ loginPasswordRequired: "dispBlock" })
      : this.setState({ loginPasswordRequired: "dispNone" });

    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Authorization:
        "Basic " +
        window.btoa(this.state.username + ":" + this.state.loginPassword),
    };

    axios
      .post(
        this.props.baseUrl + "auth/login",
        {},
        {
          headers,
        }
      )
      .then((res) => {
        sessionStorage.setItem("uuid", res.data.id);
        sessionStorage.setItem("access-token", res.headers["access-token"]);

        this.setState({
          loggedIn: true,
        });

        this.onModalClose();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  onInputUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  onInputLoginPassword = (e) => {
    this.setState({ loginPassword: e.target.value });
  };

  onRegisterClick = () => {
    this.state.firstname === ""
      ? this.setState({ firstnameRequired: "dispBlock" })
      : this.setState({ firstnameRequired: "dispNone" });
    this.state.lastname === ""
      ? this.setState({ lastnameRequired: "dispBlock" })
      : this.setState({ lastnameRequired: "dispNone" });
    this.state.email === ""
      ? this.setState({ emailRequired: "dispBlock" })
      : this.setState({ emailRequired: "dispNone" });
    this.state.registerPassword === ""
      ? this.setState({ registerPasswordRequired: "dispBlock" })
      : this.setState({ registerPasswordRequired: "dispNone" });
    this.state.contact === ""
      ? this.setState({ contactRequired: "dispBlock" })
      : this.setState({ contactRequired: "dispNone" });

    let dataSignup = JSON.stringify({
      email_address: this.state.email,
      first_name: this.state.firstname,
      last_name: this.state.lastname,
      mobile_number: this.state.contact,
      password: this.state.registerPassword,
    });

    let XHRRequest = new XMLHttpRequest();
    let that = this;

    XHRRequest.open("POST", this.props.baseUrl + "signup");
    XHRRequest.setRequestHeader("Content-Type", "application/json");
    XHRRequest.setRequestHeader("Cache-Control", "no-cache");
    XHRRequest.send(dataSignup);

    XHRRequest.addEventListener("readystatechange", (res) => {
      if (res.target.status === 201) {
        that.setState({
          registrationSuccess: true,
        });
      }
    });
  };

  inputFirstNameChangeHandler = (e) => {
    this.setState({ firstname: e.target.value });
  };

  inputLastNameChangeHandler = (e) => {
    this.setState({ lastname: e.target.value });
  };

  inputEmailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  inputRegisterPasswordChangeHandler = (e) => {
    this.setState({ registerPassword: e.target.value });
  };

  inputContactChangeHandler = (e) => {
    this.setState({ contact: e.target.value });
  };

  onLogout = (e) => {
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Authorization: "Bearer " + sessionStorage.getItem("access-token"),
    };

    axios
      .post(
        this.props.baseUrl + "auth/logout",
        {},
        {
          headers,
        }
      )
      .then((res) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");

        this.setState({
          loggedIn: false,
        });
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <header className="app-header">
          <img src={logo} className="app-logo" alt="Movies App Logo" />
          {!this.state.loggedIn ? (
            <div className="login-button">
              <Button
                variant="contained"
                color="default"
                onClick={this.onModalOpen}
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="login-button">
              <Button
                variant="contained"
                color="default"
                onClick={this.onLogout}
              >
                Logout
              </Button>
            </div>
          )}
          {this.props.showBookShowButton === "true" && !this.state.loggedIn ? (
            <div className="bookshow-button">
              <Button
                variant="contained"
                color="primary"
                onClick={this.onModalOpen}
              >
                Book Show
              </Button>
            </div>
          ) : (
            ""
          )}

          {this.props.showBookShowButton === "true" && this.state.loggedIn ? (
            <div className="bookshow-button">
              <Link to={"/bookshow/" + this.props.id}>
                <Button variant="contained" color="primary">
                  Book Show
                </Button>
              </Link>
            </div>
          ) : (
            ""
          )}
        </header>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalOpen}
          contentLabel="Login"
          onRequestClose={this.onModalClose}
          style={customStyles}
        >
          <Tabs
            className="tabs"
            value={this.state.value}
            onChange={this.onTabChange}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {this.state.value === 0 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  type="text"
                  username={this.state.username}
                  onChange={this.onInputUsername}
                />
                <FormHelperText className={this.state.usernameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                <Input
                  id="loginPassword"
                  type="password"
                  loginpassword={this.state.loginPassword}
                  onChange={this.onInputLoginPassword}
                />
                <FormHelperText className={this.state.loginPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              {this.state.loggedIn === true && (
                <FormControl>
                  <span className="successText">Login Successful!</span>
                </FormControl>
              )}
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.onLoginClick}
              >
                LOGIN
              </Button>
            </TabContainer>
          )}

          {this.state.value === 1 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <Input
                  id="firstname"
                  type="text"
                  firstname={this.state.firstname}
                  onChange={this.inputFirstNameChangeHandler}
                />
                <FormHelperText className={this.state.firstnameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <Input
                  id="lastname"
                  type="text"
                  lastname={this.state.lastname}
                  onChange={this.inputLastNameChangeHandler}
                />
                <FormHelperText className={this.state.lastnameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="text"
                  email={this.state.email}
                  onChange={this.inputEmailChangeHandler}
                />
                <FormHelperText className={this.state.emailRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                <Input
                  id="registerPassword"
                  type="password"
                  registerpassword={this.state.registerPassword}
                  onChange={this.inputRegisterPasswordChangeHandler}
                />
                <FormHelperText className={this.state.registerPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                <Input
                  id="contact"
                  type="text"
                  contact={this.state.contact}
                  onChange={this.inputContactChangeHandler}
                />
                <FormHelperText className={this.state.contactRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              {this.state.registrationSuccess === true && (
                <FormControl>
                  <span className="successText">
                    Registration Successful. Please Login!
                  </span>
                </FormControl>
              )}
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.onRegisterClick}
              >
                REGISTER
              </Button>
            </TabContainer>
          )}
        </Modal>
      </div>
    );
  }
}

export default Header;