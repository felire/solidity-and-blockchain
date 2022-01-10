/* eslint-disable @next/next/no-css-tags */
import type { NextPage } from 'next'
import { useCallback, useEffect, useMemo } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from "semantic-ui-react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout';
import { Link } from "../routes";

interface CampaignProps {
  campaigns: string[];
}
const Campaign: NextPage<CampaignProps> = ({campaigns}) => {
  const Campaigns = useMemo(() => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
        <Link route={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }, [campaigns]);


  return (
  <Layout>
    <div>
      <h3>Open Campaigns</h3>
      <Link route="/campaigns/new">
        <a>
          <Button content="Create Campaign" icon="add circle" primary floated="right" />
        </a>
      </Link>
      {Campaigns}
    </div>
  </Layout>
  )
}

Campaign.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return {campaigns}
}
export default Campaign
