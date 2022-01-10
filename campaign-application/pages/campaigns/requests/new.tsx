import React, { Component, useState, useRef } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/layout";

const RequestNew = ({address}) => {
  const description = useRef('');
  const value = useRef('');
  const recipient = useRef('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(address);

    setLoading(true);
    setError('');

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description.current, web3.utils.toWei(value.current, "ether"), recipient.current)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDescription = (event) => {
   description.current = event.target.value;
  }
  const handleValue = (event) => {
   value.current = event.target.value;
  }
  const handleRecipient = (event) => {
   recipient.current = event.target.value;
  }
    return (
      <Layout>
        <Link route={`/campaigns/${address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={onSubmit} error={!!error}>
          <Form.Field>
            <label>Description</label>
            <Input
              onChange={handleDescription}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              onChange={handleValue}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              onChange={handleRecipient}
            />
          </Form.Field>
          <Message error header="Oops!" content={error} />
          <Button primary loading={loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
}

RequestNew.getInitialProps = (props) =>  {
    const { address } = props.query;

    return { address };
}

export default RequestNew;
