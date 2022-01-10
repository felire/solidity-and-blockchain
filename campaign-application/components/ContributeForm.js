import React, { useState, useRef } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = ({address}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const value = useRef('');

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(address);
    setError('');
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value.current, "ether"),
      });
      Router.replaceRoute(`/campaigns/${address}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleChange = (event) => {
    value.current = event.target.value;
  }
    return (
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            onChange={handleChange}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={error} />
        <Button primary loading={loading}>
          Contribute!
        </Button>
      </Form>
    );
}

export default ContributeForm;
