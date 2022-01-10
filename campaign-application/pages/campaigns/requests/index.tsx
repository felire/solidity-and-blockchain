import React, {useMemo} from 'react';
import { Button, Table } from "semantic-ui-react";
import Layout from '../../../components/layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from "../../../components/RequestRow";

const Requests = ({ contractAddress, requests, approversCount, requestsCount }) => {

 const RequestRows = useMemo(() => {
  return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={contractAddress}
          approversCount={approversCount}
        />
      );
  });
 }, [contractAddress, requests, approversCount]);

 const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${contractAddress}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{RequestRows}</Body>
        </Table>
        <div>Found {requestsCount} requests.</div>
      </Layout>
    );
}

Requests.getInitialProps = async (props) => {
  const address = props.query.address;
  const campaignContract = Campaign(address);
  const requestsCount = await campaignContract.methods.getRequestsCount().call();
  const requests = await Promise.all(
   Array(parseInt(requestsCount)).fill({}).map((_, index) => campaignContract.methods.requests(index).call())
  )
  const approversCount = await campaignContract.methods.approversCount().call();
  return {
   approversCount,
   contractAddress: address,
   requests,
   requestsCount,
  }
}

export default Requests;
