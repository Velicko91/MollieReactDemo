import React, { useState, useEffect, MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import "./mollie.css";
// import '/base.css'

export default class MollieComponent extends React.Component {

  //Make mollie ref
  mollie = React.createRef();

  //Create field refs
  formErrorRef = React.createRef();
  cardNumber = React.createRef();
  cardNumberErrorRef = React.createRef();
  cardHolder = React.createRef();
  cardHolderErrorRef = React.createRef();
  expiryDate = React.createRef();
  expiryDateErrorRef = React.createRef();
  verificationCode = React.createRef();
  verificationCodeErrorRef = React.createRef();

  //Make div refs
  cardNumberDivRef = React.createRef();
  cardHolderDivRef = React.createRef();
  expiryDateDivRef = React.createRef();
  verificationCodeDivRef = React.createRef();

  form = React.createRef();


  constructor(props) {
    super(props);
    this.state = { message: "", cardToken: "", buttonDisabled: true };
    this.disableForm = this.disableForm.bind(this);
    this.enableForm = this.enableForm.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    //check if mollie components have been initialised
    if (this.mollie.current) {
      return;
    }

    this.mollie.current = window.Mollie("pfl_A2RUnbyn6b", {
      locale: "nl_NL",
      testmode: "test"
    });

    //create Mounting objects
    this.cardNumber.current = this.mollie.current.createComponent("cardNumber");
    this.cardHolder.current = this.mollie.current.createComponent("cardHolder");
    this.expiryDate.current = this.mollie.current.createComponent("expiryDate");
    this.verificationCode.current = this.mollie.current.createComponent("verificationCode");

    //Mount objects
    this.cardNumber.current.mount("#card-number");
    this.cardHolder.current.mount("#card-holder");
    this.expiryDate.current.mount("#expiry-date");
    this.verificationCode.current.mount("#verification-code");

    this.cardHolder.current.addEventListener("change", (event) => {
      if (this.cardHolderErrorRef.current) {
        if (event.error && event.touched) {
          this.cardHolderErrorRef.current.textContent = event.error;
        } else {
          this.cardHolderErrorRef.current.textContent = "";
        }
      }
    });

    this.cardNumber.current.addEventListener("change", (event) => {
      if (this.cardNumberErrorRef.current) {
        if (event.error && event.touched) {
          this.cardNumberErrorRef.current.textContent = event.error;
        } else {
          this.cardNumberErrorRef.current.textContent = "";
        }
      }
    });

    this.expiryDate.current.addEventListener("change", (event) => {
      if (this.expiryDateErrorRef.current) {
        if (event.error && event.touched) {
          this.expiryDateErrorRef.current.textContent = event.error;
        } else {
          this.expiryDateErrorRef.current.textContent = "";
        }
      }
    });

    this.verificationCode.current.addEventListener("change", (event) => {
      if (this.verificationCodeErrorRef.current) {
        if (event.error && event.touched) {
          this.verificationCodeErrorRef.current.textContent = event.error;
        } else {
          this.verificationCodeErrorRef.current.textContent = "";
        }
      }
    });
  }

  disableForm() {
    this.setState({ buttonDisabled: true });
  }
  enableForm() {
    this.setState({ buttonDisabled: false });
  }

  // /**
  //  * Enables the form inputs and submit button
  //  */

  // /**
  //  * Submit handler
  //  */
  async submit(event) {
    event.preventDefault();
    this.disableForm();
    // Reset possible form error
    if (this.formErrorRef.current) this.formErrorRef.current.textContent = "";
    // Get a payment token
    const { token, error } = await this.mollie.current.createToken();

    if (error) {
      this.enableForm();
      this.formErrorRef.current.textContent = error.message;
      return;
    }

    //Show that token exists
    console.log(token);

    // Add token to the form
    //const tokenInput = document.createElement("input");

    // Re-submit form to the server
    //this.form.current.submit();
  }

  render() {
    return (
      <div className="wrapper">
        <form method="post" className="form" id="mcForm" onSubmit={this.submit}>
          <div className="form-fields">
            <div className="form-group form-group--card-holder">
              <label className="label" htmlFor="card-holder">
                Card holder
              </label>
              <div id="card-holder" tabIndex={0} ref={this.cardHolderDivRef}></div>
              <div
                id="card-holder-error"
                ref={this.cardHolderErrorRef}
                className="field-error"
                role="alert"
              ></div>
            </div>

            <div className="form-group form-group--card-number">
              <label className="label" htmlFor="card-number">
                Card number
              </label>
              <div id="card-number" tabIndex={1} ref={this.cardNumberDivRef}></div>
              <div
                id="card-number-error"
                ref={this.cardNumberErrorRef}
                className="field-error"
                role="alert"
              ></div>
            </div>

            <div className="form-group form-group--expiry-date">
              <label className="label" htmlFor="expiry-date">
                Expiry date
              </label>
              <div id="expiry-date" tabIndex={2} ref={this.expiryDateDivRef}></div>
              <div
                id="expiry-date-error"
                ref={this.expiryDateErrorRef}
                className="field-error"
                role="alert"
              ></div>
            </div>

            <div className="form-group form-group--verification-code">
              <label className="label" htmlFor="verification-code">
                Verification code
              </label>
              <div id="verification-code" tabIndex={3} ref={this.verificationCodeDivRef}></div>
              <div
                id="verification-code-error"
                ref={this.verificationCodeErrorRef}
                className="field-error"
                role="alert"
              ></div>
            </div>
          </div>

          <button
            id="submit-button"
            tabIndex={4}
            className="submit-button"
            type="submit"
          >
            Pay
          </button>

          <div
            id="form-error"
            className="form-error"
            ref={this.formErrorRef}
            role="alert"
          ></div>
          {/* <input name="cardToken" type="hidden" value={this.state.cardToken}> </input> */}
        </form>
      </div>
    );
  }
}
