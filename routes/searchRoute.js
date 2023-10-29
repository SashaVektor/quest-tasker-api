import express from 'express'
import { getSearchedItems } from '../controllers/searchController.js';


const searchRouter = express.Router();

searchRouter.get("/", getSearchedItems)



export default searchRouter