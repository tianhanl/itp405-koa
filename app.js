const Koa = require('koa');
const Router = require('koa-router');
const Genre = require('./models/genre');
const Track = require('./models/track');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/api/genres', async function(context) {
  let genres = await Genre.fetchAll();
  context.body = genres;
});

router.get('/api/genres/:id', async function(context) {
  let id = context.params.id;
  let genre = new Genre({ GenreId: id });
  genre = await genre.fetch();
  try {
    if (!genre) {
      throw new Error(`Genre ${id} cannot be found`);
    }
    context.body = genre;
  } catch (e) {
    context.status = 404;
    context.body = {
      error: `GenreId ${id} is in valid`
    };
  }
});

router.get('/api/tracks/:id', async context => {
  const id = context.params.id;
  let track = new Track({ TrackId: id });
  track = await track.fetch();
  context.body = track;
});

router.get('/api/tracks', async context => {
  let tracks = await Track.fetchAll();
  context.body = tracks;
});

router.delete('/api/tracks/:id', async context => {
  const id = context.params.id;
  let track = new Track({
    TrackId: id
  });
  let testTrack = await track.fetch();
  try {
    if (!testTrack) throw new Error('Track not found');
    await track.destroy();
    context.status = 202;
  } catch (e) {
    context.status = 404;
    context.body = {
      error: e.message
    };
  }
});

router.post('/api/genres', async context => {
  // verify that name isn't blank
  // verify that name hasn't alread  been used
  let name = context.request.body.name;
  try {
    if (!name) throw new Error(`A genre must have a name`);
    let genre = new Genre({ Name: name });
    let genreWasFound = await genre.fetch();
    if (genreWasFound) throw new Error(`${name} has been used`);
  } catch (e) {
    context.status = 422;
    context.body = {
      error: e.message
    };
  }
  await genre.save();
  context.body = genre;
});
app.use(router.routes());

app.listen(process.env.PORT || 3000);
