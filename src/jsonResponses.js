const users = {};

// responds with json object
const respondJSON = (request, response, status, object) => {
  console.log("entering jsonResponses.js > respondJSON()");
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// responds without body (only metadata)
const respondJSONMeta = (request, response, status) => {
  console.log("entering jsonResponses.js > respondJSONMeta()");
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addAlbum = (request, response, body) => {
  console.log("entering jsonResponses.js > addAlbum()");
  console.log(body);
  // default response
  const responseJSON = { message: 'Message: not all required have been filled in' };

  // if ot all required have been filled in
  if (!body.name || !body.album || !body.artist || !body.score || !body.cover || !body.embed) {
    console.log('not all required have been filled in');
    // give failure id
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // updating pre-existing user
  console.log('adding user');

  // if this user does not exist yet
  if (!users[body.name]) {
    console.log(`adding user:${body.name}`);
    responseCode = 201; // adding new user
    users[body.name] = {};
  }// create new user with given name

  // set fields
  users[body.name].name = body.name;
  users[body.name].album = body.albume;
  users[body.name].artist = body.artist;
  users[body.name].score = body.score;
  users[body.name].cover = body.cover;
  users[body.name].embed = body.embed;

  console.log(users[body.name]);

  // return 201
  if (responseCode === 201) {
    responseJSON.message = 'Message: Created Succesfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // return 204
  return respondJSONMeta(request, response, responseCode);
};

const getUserCollection = (request, response) => respondJSONMeta(request, response, 200);

module.exports = {
  addAlbum,
  getUserCollection,
};
