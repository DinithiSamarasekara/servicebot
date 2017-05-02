import React from 'react';
import cookie from 'react-cookie';
import Load from '../../utilities/load.jsx';
import Fetcher from "../../utilities/fetcher.jsx"
import {browserHistory} from 'react-router';
import Modal from '../../utilities/modal.jsx';
import BillingSettingForm from '../forms/billing-settings-form.jsx';
import Buttons from '../../elements/buttons.jsx';

/**
 * Uses Modal.jsx component to house the content of this modal
 * Renders BillingSettingForm component
 */
class ModalPaymentSetup extends React.Component {

    constructor(props){
        super(props);
        let currentUserId = cookie.load("uid");
        let uid = currentUserId

        console.log("modal payment setup opened");

        if(this.props.ownerId){
            uid = this.props.ownerId;
            console.log("modalPaymentSetup: owner", uid);
        }
        this.state = {form: '', ownerId: uid, currentUserId: currentUserId};
        this.handleCreditCard = this.handleCreditCard.bind(this);
        this.handleBankAccount = this.handleBankAccount.bind(this);
        this.handleBackBtn = this.handleBackBtn.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleModalCallback = this.handleModalCallback.bind(this);
        this.getModalMessageTitle = this.getModalMessageTitle.bind(this);
    }

    handleUnauthorized(){
        browserHistory.push("/login");
    }

    handleCreditCard(){
        this.setState({form: 'credit_card'});
    }
    handleBankAccount(){
        this.setState({form: 'bank_account'});
    }
    handleBackBtn(){
        this.setState({form: ''});
    }
    handleResponse(response){
        if(response.created){
            console.log('inside payment setup modal', response);
            this.handleModalCallback(response);
        }
    }
    handleModalCallback(response){
        if(this.props.modalCallback){
            this.props.modalCallback(response);
        }
    }

    getModalMessageTitle(){
        if(this.props.message){
            return ( this.props.message.title );
        }else {
            if (this.state.currentUserId == this.state.ownerId) {
                return ( "Looks like you don't have a payment source in your account, let's setup your payment here first." );
            } else {
                return ( "Looks like the user: {this.state.ownerId} doesn't have a payment source in their account, let's setup a payment for them first." );
            }
        }
    }

    getModalMessageBody(){
        if(this.props.message){
            return (this.props.message.body);
        }else{
            return ( "You will be returned to your approval page once your payment is setup." );
        }
    }

    render () {
        let self = this;
        let pageName = "Payment Setup";

        return(
            <Modal modalTitle={pageName} hideCloseBtn={true} show={self.props.show} hide={self.props.hide} hideFooter={true}>
                <div className="table-responsive">
                    <div className="p-20">
                        <div className="row">
                            <div className="col-xs-12">
                                <p><strong>{self.getModalMessageTitle()}</strong></p>
                                <p className="small">{self.getModalMessageBody()}</p>
                                {self.state.form == 'credit_card' &&
                                    <div><BillingSettingForm ownerId={self.state.ownerId} modalCallback={self.handleResponse}/></div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`modal-footer text-right p-b-20`}>
                        {self.state.form == 'credit_card' ?
                            <Buttons text="Back" btnType="default" onClick={self.handleBackBtn}/>
                            :
                            <div>
                                <Buttons containerClass="inline" btnType="primary" text="Add Credit Card" onClick={self.handleCreditCard}/>
                                <Buttons containerClass="inline" btnType="default" text="Cancel" onClick={self.props.hide}/>
                            </div>
                        }

                    </div>
                </div>
            </Modal>
        );
    }
}

export default ModalPaymentSetup;