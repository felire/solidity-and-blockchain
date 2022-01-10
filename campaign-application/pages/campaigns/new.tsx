/* eslint-disable @next/next/no-css-tags */
import type { NextPage } from 'next'
import { useMemo, useRef, useState } from 'react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from '../../components/layout';
import { Router } from '../../routes';
interface CampaignProps {
  campaigns: string[];
}
const NewCampaign: NextPage<CampaignProps> = () => {
  const minimumContribution = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
   minimumContribution.current = (event.target.value);
  }

  const onSubmit = async (event) => {
   event.preventDefault();
   setLoading(true);
   setError('');
   try{
    
    const accounts = await web3.eth.getAccounts();
    await factory.methods.createCampaign(minimumContribution.current).send({
     from: accounts[0]
    });
    Router.pushRoute('/');
   }
   catch(err){
     setError(err.message);
   }
   setLoading(false);
  };

  return (
  <Layout>
    <h3>Create a Campaign</h3>
    <Form onSubmit={onSubmit} error={!!error}>
     <Form.Field>
      <label>Minimum Contribution</label>
      <Input label="wei" labelPosition="right" onChange={handleInputChange}/>
     </Form.Field>
     <Message error header="Oops!" content={error} />
     <Button primary loading={loading}>Create</Button>
    </Form>
   </Layout>
  )
}

export default NewCampaign
