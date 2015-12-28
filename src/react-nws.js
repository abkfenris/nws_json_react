var forecastToArray = function(forecast) {
  var output = [];
  for (var i in forecast.data.temperature) {
    var period = {};
    period.id = i;
    for (var key in forecast.data) {
      period[key] = forecast.data[key][i];
    };

    for (var key in forecast.time) {
      period[key] = forecast.time[key][i];
    };

    output.push(period);
  };

  return output;
};

var Forecast = React.createClass({
  loadForecastFromServer: function() {
    var url = 'http://forecast.weather.gov/MapClick.php?lat=' + this.props.lat + '&lon=' + this.props.lon + '&FcstType=json';
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          data: data,
          forecast: forecastToArray(data),
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    })
  },
  getInitialState: function() {
    return {data: false};
  },
  componentDidMount: function() {
    this.loadForecastFromServer();
    //setInterval(this.loadForecastFromServer, this.props.pollInterval)
  },
  render: function() {
    if ( !this.state.data ) {
      return (
        <h1>Loading data from NWS</h1>
      );
    } else if ( !this.state.data.productionCenter ) {
      console.log(this.state.data);
      return (
        <h1>Data not loaded correctly</h1>
      );
    }
    return (
      <div class="forecastResult">
        <h1>Forecast loaded from {this.state.data.productionCenter}</h1>
        <ForecastGraphicalList data={this.state.forecast} />
      </div>
    )
  },
});

var ForecastGraphicalList = React.createClass({
  render: function() {
    var periodNodes = this.props.data.map(function(data) {
      return (
        <li key={data.id}>{data.startPeriodName}</li>
      )
    });
    return (
      <ul className="forecastGraphicalList">
        {periodNodes}
      </ul>
    )
  }
});

React.render(
  <Forecast lat="44.098601844800385" lon="-70.69908771582459" pollInterval={200000}/>,
  document.getElementById('forecast')
)
