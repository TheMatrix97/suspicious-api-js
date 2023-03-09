'use strict';

const { default: axios } = require("axios");

class KittyController {
    constructor(){}

    async getCoolCat(){
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            return response.data[0].url;
        }catch (error){
            console.log(error);
            throw error;
        }
    }
}

module.exports = {KittyController};