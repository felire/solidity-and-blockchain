import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0xd563c11D0eB84eb8998659279D10fA4Df31EcddC');

export default instance;
