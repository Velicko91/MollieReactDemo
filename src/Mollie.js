import React, { useState, useEffect, MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import "./mollie.css";
// import '/base.css'

export default class MollieComponent extends React.Component {
  mollie;
  formErrorRef = React.createRef();
  cardNumber;
  cardNumberErrorRef = React.createRef();
  cardHolder;
  cardHolderErrorRef = React.createRef();
  expiryDate;
  expiryDateErrorRef = React.createRef();
  verificationCode;
  verificationCodeErrorRef = React.createRef();
  form = React.createRef();
  constructor(props) {
    super(props);
    this.state = { message: "", cardToken: "", buttonDisabled: true };
    this.mollie = window.Mollie(this.props.mollieProfileKey, {
      locale: this.props.mollieLocale,
      testmode: this.props.mollieTestMode
    });
    this.cardNumber = this.mollie.createComponent("cardNumber");
    this.cardHolder = this.mollie.createComponent("cardHolder");
    this.expiryDate = this.mollie.createComponent("expiryDate");
    this.verificationCode = this.mollie.createComponent("verificationCode");
    this.disableForm = this.disableForm.bind(this);
    this.enableForm = this.enableForm.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.cardNumber.mount("#card-number");
    this.cardHolder.mount("#card-holder");
    this.expiryDate.mount("#expiry-date");
    this.verificationCode.mount("#verification-code");

    this.cardHolder.addEventListener("change", (event) => {
      if (this.cardHolderErrorRef.current) {
        if (event.error && event.touched) {
          this.cardHolderErrorRef.current.textContent = event.error;
        } else {
          this.cardHolderErrorRef.current.textContent = "";
        }
      }
    });

    this.cardNumber.addEventListener("change", (event) => {
      if (this.cardNumberErrorRef.current) {
        if (event.error && event.touched) {
          this.cardNumberErrorRef.current.textContent = event.error;
        } else {
          this.cardNumberErrorRef.current.textContent = "";
        }
      }
    });

    this.expiryDate.addEventListener("change", (event) => {
      if (this.expiryDateErrorRef.current) {
        if (event.error && event.touched) {
          this.expiryDateErrorRef.current.textContent = event.error;
        } else {
          this.expiryDateErrorRef.current.textContent = "";
        }
      }
    });

    this.verificationCode.addEventListener("change", (event) => {
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
    const { token, error } = await this.mollie.createToken();

    if (error) {
      this.enableForm();
      this.formErrorRef.current.textContent = error.message;
      return;
    }

    // Add token to the form
    const tokenInput = document.createElement("input");

    // Re-submit form to the server
    this.form.current.submit();
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
              <div id="card-holder" tabIndex={0}></div>
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
              <div id="card-number" tabIndex={1}></div>
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
              <div id="expiry-date" tabIndex={2}></div>
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
              <div id="verification-code" tabIndex={3}></div>
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
