import express from 'express';
import router from './game.route';
const route = express.Router();


router.test('/test', (req,res)=> {
    console.log('user test is working');
})