import React, {useMemo} from 'react';
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';

const CampaignShow = ({contractAddress, minimumContribution, balance, requestsCount, approversCount, manager}) => {

 const CampaignData = useMemo(() => {
     const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];
    return <Card.Group items={items} />;
}, [approversCount, manager, minimumContribution, requestsCount, balance])


    

 return (
  <Layout>
   <h3>Campaign show</h3>
   <Grid>
   <Grid.Row />
   <Grid.Column width={10}>
    {CampaignData}
   </Grid.Column>
   <Grid.Column width={6}>
    <ContributeForm address={contractAddress} />
   </Grid.Column>
   <Grid.Row />
   <Grid.Row>
   <Grid.Column>
    <Link route={`/campaigns/${contractAddress}/requests`}>
     <a>
      <Button primary content="View Requests"/>
     </a>
    </Link>
    </Grid.Column>
   </Grid.Row>
   </Grid>
  </Layout>
 )
}

CampaignShow.getInitialProps = async (props) => {
  const address = props.query.address;
  const campaignContract = Campaign(address);
  const summaryInfo = await campaignContract.methods.getSummary().call();

  return {
   contractAddress: address,
   minimumContribution: summaryInfo['0'],
   balance: summaryInfo['1'],
   requestsCount: summaryInfo['2'],
   approversCount: summaryInfo['3'],
   manager: summaryInfo['4'],
  }
}

export default CampaignShow;
