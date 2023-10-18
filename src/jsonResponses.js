const users = {};

// responds with json object
const respondJSON = (request, response, status, object) => {
  console.log('entering jsonResponses.js > respondJSON()');
  console.log(`writeHead${status}`); //
  response.writeHead(status, { 'Content-Type': 'application/json' });
  console.log(`responding with: ${JSON.stringify(object)}`); //
  response.write(JSON.stringify(object));
  response.end();
};

// responds without body (only metadata)
const respondJSONMeta = (request, response, status) => {
  console.log('entering jsonResponses.js > respondJSONMeta()');
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addAlbum = (request, response, body) => {
  console.log('entering jsonResponses.js > addAlbum()');
  console.log(body);
  // default response
  const responseJSON = { message: 'Not all required fields have been filled in' };

  // if ot all required have been filled in
  if (!body.name || !body.album || !body.artist || !body.score || !body.cover || !body.embed) {
    console.log('not all required have been filled in');
    // give failure id
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // updating pre-existing user

  // if this user does not exist yet
  if (!users[body.name]) {
    console.log(`adding user:${body.name}`);
    responseJSON.message = 'Created Succesfully';
    responseCode = 201; // adding new user
    users[body.name] = {};
  }// create new user with given name

  // set fields
  // users[body.name].name = body.name;
  users[body.name][body.album] = {};
  users[body.name][body.album].artist = body.artist;
  users[body.name][body.album].score = body.score;
  users[body.name][body.album].cover = body.cover;
  users[body.name][body.album].embed = body.embed;

  console.log(users[body.name]);

  // put user's info in JSON response
  responseJSON.userName = [body.name];
  responseJSON.collection = users[body.name];

  console.log(`users: ${JSON.stringify(users)}`);

  // return 201
  if (responseCode === 201) {
    responseJSON.message = 'Created Succesfully';
    return respondJSON(request, response, 201, responseJSON);
  }

  // return 204
  if (responseCode === 204) {
    responseJSON.message = 'Updated Successfully';
    return respondJSON(request, response, 204, responseJSON);
  }
  //return respondJSONMeta(request, response, responseCode);
};

const getUserCollection = (request, response, method, params) => {
  // store username
  const userName = params.userNameGet;

  console.log('entering jsonResponses.js > getUserCollection');

  const responseJSON = { message: 'User not found' };
  if (userName) {
    responseJSON.message = 'Bad Request';
    // if GET request
    if (method === 'GET') {
      console.log(`  GET request for ${userName}`);
      responseJSON.message = 'User found';
      responseJSON.userName = userName;
      responseJSON.collectionJSON = users[userName];

      return respondJSON(request, response, 200, responseJSON);
    } else { // otherwise it is a HEAD request
      console.log(`  HEAD request for ${params.userNameGet}`);
      return respondJSONMeta(request, response, 200);
    }
    return respondJSON(request, response, 400, responseJSON); // fix responseJson
  }
};

module.exports = {
  addAlbum,
  getUserCollection,
};
