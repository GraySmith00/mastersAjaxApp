const app = require('./app');
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), process.env.IP, function() {
  console.log(`Server is up and cookin! -> PORT ${server.address().port}`);
});
