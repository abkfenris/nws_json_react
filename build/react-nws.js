var forecastToArray = function (forecast) {
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
  displayName: 'Forecast',

  loadForecastFromServer: function () {
    var url = 'http://forecast.weather.gov/MapClick.php?lat=' + this.props.lat + '&lon=' + this.props.lon + '&FcstType=json&callback=nwsresponse';
    $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: false,
      success: (function (data) {
        this.setState({
          data: data,
          forecast: forecastToArray(data)
        });
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(url, status, err.toString());
      }).bind(this)
    });
  },
  getInitialState: function () {
    return { data: false };
  },
  componentDidMount: function () {
    this.loadForecastFromServer();
    //setInterval(this.loadForecastFromServer, this.props.pollInterval)
  },
  render: function () {
    if (!this.state.data) {
      return React.createElement(
        'div',
        { className: 'forecastLoading' },
        'Loading data from NWS'
      );
    } else if (!this.state.data.productionCenter) {
      console.log(this.state.data);
      return React.createElement(
        'div',
        { className: 'forecastFailure' },
        'Data not loaded correctly'
      );
    }
    return React.createElement(
      'div',
      { className: 'forecastResult' },
      React.createElement(ForecastGraphicalList, { data: this.state.forecast })
    );
  }
});

var ForecastGraphicalList = React.createClass({
  displayName: 'ForecastGraphicalList',

  render: function () {
    var periodNodes = this.props.data.map(function (data) {
      return React.createElement(ForecastGraphicalPeriod, { data: data, key: data.id });
    });
    return React.createElement(
      'ul',
      { className: 'forecastGraphicalList' },
      periodNodes
    );
  }
});

var ForecastGraphicalPeriod = React.createClass({
  displayName: 'ForecastGraphicalPeriod',

  render: function () {
    var data = this.props.data;
    var desc = data.startPeriodName + ": " + data.text;
    var tempClass = "temp temp-" + data.tempLabel;
    return React.createElement(
      'li',
      { className: 'forecast-period', key: data.id },
      React.createElement(
        'p',
        { className: 'period-name' },
        data.startPeriodName
      ),
      React.createElement('img', { className: 'forecast-icon', src: data.iconLink, alt: desc, title: desc }),
      React.createElement(
        'p',
        { className: 'short-desc' },
        data.weather
      ),
      React.createElement(
        'p',
        { className: tempClass },
        data.tempLabel,
        ': ',
        data.temperature,
        ' ºF'
      )
    );
  }
});