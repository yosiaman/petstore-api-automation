const { expect } = require('chai');
const { conforms } = require('lodash');
const { addNewPet, getPetByPetId } = require('../../api/pet-api');
let testData = require('../../data/003-add-new-pet-data.json');
const { getPetStatus, getPetCategory, getPetId, getPetName,
    getPetTags } = require('../../helper/pet-data-generator.js');

describe('API Check addNewPet', () => {
    // describe data
    let postRequest = {};

    it(`${testData.TC_001.tc_title}`, async function() {
        if (testData.TC_001.is_run) {
            // compose request body
            let tc_request_body = testData.TC_001.tc_request_body;
            const tc_validator = testData.TC_001.tc_validator
            tc_request_body.id = getPetId();
            tc_request_body.name = getPetName();
            tc_request_body.status = getPetStatus();
            tc_request_body.category = getPetCategory();
            tc_request_body.tags = getPetTags();

            // api hit
            const response = await addNewPet(tc_request_body);

            // response structure checking
            expect(response.status).to.equal(tc_validator.http_code);
            expect(response.body).to.have.keys(tc_validator.parent_keys);
            expect(response.body.category).to.be.an(tc_validator.category_type);
            expect(response.body.tags).to.be.an(tc_validator.tags_type);

            // response content checking
            expect(response.body.id).to.equal(tc_request_body.id);
            expect(response.body.name).to.equal(tc_request_body.name);
            expect(response.body.status).to.equal(tc_request_body.status);
            expect(response.body.category.id).to.equal(tc_request_body.category.id);
            expect(response.body.category.name).to.equal(tc_request_body.category.name)
            for (var i=0; i<tc_request_body.tags.length; i++) {
                expect(response.body.tags[i].id).to.equal(tc_request_body.tags[i].id);
                expect(response.body.tags[i].name).to.equal(tc_request_body.tags[i].name);
            }

            // bring to describe data
            postRequest = tc_request_body;
        } else {
            this.skip();
        }
    })

    afterEach(async function() {
        // check the data integrity between post and get pet api
        const response = await getPetByPetId(postRequest.id);
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(postRequest.id);
        expect(response.body.name).to.equal(postRequest.name);
        expect(response.body.status).to.equal(postRequest.status);
        expect(response.body.category.id).to.equal(postRequest.category.id);
        expect(response.body.category.name).to.equal(postRequest.category.name)
        for (var i=0; i<postRequest.tags.length; i++) {
            expect(response.body.tags[i].id).to.equal(postRequest.tags[i].id);
            expect(response.body.tags[i].name).to.equal(postRequest.tags[i].name);
        }

        // reset used describe data
        postRequest = {};
    })
})