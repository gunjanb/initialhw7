/*
*/

(function () {
    'use strict';
    //=============================================================================

    var people = [];
    var nextId = 1000;
    var BASE_URL = 'https://pacific-meadow-64112.herokuapp.com/data-api/';
    var collection = 'gbhargava';

    getPeople();
    displayPeople();

    $('#new-person').on('click', addNewPerson);


    //=============================================================================


    function displayPeople() {
        var newTr, newTd, newButton;
        $('#people').empty();
        people.forEach(function (obj, i) {
            newTr = $('<tr>');
            newTd = $('<td>');
            newTd.text(obj.name);
            newTr.append(newTd);
            newTd = $('<td>');
            newTd.text(obj.age);
            newTr.append(newTd);
            newTd = $('<td>');
            newButton = $('<button>').text('Edit');
            newButton.click(function () {
            //console.log("val of edit personi"+ i);
            editPerson(i);
            });
            newTd.append(newButton);
            newButton = $('<button>').text('Delete');
            newButton.click(function () {
                confirmAndDeletePerson(i);
                people.splice(i, 1);
                displayPeople();
            });
            newTd.append(newButton);
            newTr.append(newTd);

            $('#people').append(newTr);
        });
        $('#table-page').show();
        $('#form-page').hide();
    }



    //=============================================================================

    function addNewPerson() {
        addOrEditPerson();
    }

    //=============================================================================

    function editPerson(i) {
        //     console.log("in edit person val of i" +i)
        //     console.log("val of person[i]"+ people[i].name);
        addOrEditPerson(people[i]);
    }

    //-----------------------------------------------------------------------------

    function confirmAndDeletePerson(i) {
        if (window.confirm('Are you sure you want to delete "' +
                             people[i].name + '"?')) {
            deletePerson(people[i]);
            people.splice(i, 1);
            displayPeople();
        } else
            displayPeople();
    }
    //-----------------------------------------------------------------------------


    function deletePerson(person) {
        //  console.log("INSIDE OF DELETE PERSON "+ person._id);

        $.ajax(BASE_URL + collection + '/' + person._id,
        {
            method: 'DELETE',
            success: null,
            error: reportAjaxError
        });
    }

    //=============================================================================

    function addOrEditPerson(person) {
        if (person) {
            $('#name').val(person.name);
            $('#age').val(person.age);
            // console.log("inside of person ")
        } else {
            $('#name').val('');
            $('#age').val('');
        }
        $('#submit').one('click', addOrUpdatePerson);
        $('#cancel').one('click', displayPeople);

        $('#table-page').hide();
        $('#form-page').show();

        //=========================================================================

        function addOrUpdatePerson() {
            var newPerson;

            if (person) {
                person.name = $('#name').val();
                person.age = $('#age').val();
                console.log("inside of person ");
                console.log("inside of person and person" + person.name)
                updatePerson(person);

            } else {
                newPerson = {
                    name: $('#name').val(),
                    age: $('#age').val()
                };
                people.push(newPerson);
                createPerson(newPerson);
            }

            displayPeople();
        }
    }


    function updatePerson(person) {
        //  console.log("inside of update person");
        //    console.log("person_id"+ person._id);
        var personData = {
            name: person.name,
            age: person.age

        };
        $.ajax(BASE_URL + collection + '/' + person._id,
        {
            method: 'PUT',
            data: personData,
            success: null,
            error: reportAjaxError
        });
    }



    function postResponseHandler(response) {
        people[people.length - 1]._id = response.created;
    }


    function createPerson(person) {

        $.ajax(BASE_URL + collection,
        {
            method: 'POST',
            data: person,
            success: postResponseHandler,
            error: reportAjaxError
        });
    }



    function getResponseHandler(response) {
        people = response;
        displayPeople();
    }


    function reportAjaxError(jqXHR, textStatus, errorThrown) {
        var msg = 'AJAX error.\n' +
            'Status Code: ' + jqXHR.status + '\n' +
            'Status: ' + textStatus;
        if (errorThrown) {
            msg += '\n' + 'Error thrown: ' + errorThrown;
        }
        if (jqXHR.responseText) {
            msg += '\n' + 'Response text: ' + jqXHR.responseText;
        }
        console.log(msg);
    }


    function getPeople() {
        $.ajax(BASE_URL + collection,
        {
            method: 'GET',
            success: getResponseHandler,
            error: reportAjaxError
        });
    }

    //=============================================================================
})();