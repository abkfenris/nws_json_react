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
    var url = 'http://forecast.weather.gov/MapClick.php?lat=' + this.props.lat + '&lon=' + this.props.lon + '&FcstType=json&callback=nwsresponse';
    $.ajax({
      url: url,
      dataType: 'jsonp',
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
        <div class="forecastLoading">Loading data from NWS</div>
      );
    } else if ( !this.state.data.productionCenter ) {
      console.log(this.state.data);
      return (
        <div class="forecastFailure">Data not loaded correctly</div>
      );
    }
    return (
      <div class="forecastResult">
        <ForecastGraphicalList data={this.state.forecast} />
      </div>
    )
  },
});

var ForecastGraphicalList = React.createClass({
  render: function() {
    var periodNodes = this.props.data.map(function(data) {
      return (
        <ForecastGraphicalPeriod data={data} key={data.id}/>
      )
    });
    return (
      <ul className="forecastGraphicalList">
        {periodNodes}
      </ul>
    )
  }
});

var ForecastGraphicalPeriod = React.createClass({
  render: function() {
    var data = this.props.data;
    var desc = data.startPeriodName + ": " + data.text;
    var tempClass = "temp temp-" + data.tempLabel;
    return (
      <li key={data.id}>
        <p class="period-name">{data.startPeriodName}</p>
        <img class="forecast-icon" src={data.iconLink} alt={desc} title={desc} />
        <p class="short-desc">{data.weather}</p>
        <p class={tempClass}>{data.tempLabel}: {data.temperature} ºF</p>
      </li>
    )
  }
})
