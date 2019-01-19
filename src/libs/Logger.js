const logLVLS = {
  debug: 1,
  info: 2,
  erro: 3,
  off: 4
};

class CustomLogger {

  constructor(logLVL='info', appname='') {
    this.logLVL = logLVLS[ logLVL ] || logLVLS[ 'info' ];
    this.appname = appname;
  }

  serverError(tags, msg, channel) {
    this.log(tags[ 0 ] || 'info', channel, msg);
  }

  sqlLog(msg) {
    this.log('info', 'SQL', msg);
  }

  log(severity='info', log_type='application', message='', extra='') {
    let curLVL = logLVLS[ severity ] || logLVLS[ 'info' ];

    if( curLVL >= this.logLVL )
      console.log( JSON.stringify({
        timestamp: new Date(),
        app_name: this.appname,
        log_type: log_type.toUpperCase(),
        severity: severity.toUpperCase(),
        message: message,
        extra: extra
      }));
  }
}

module.exports = CustomLogger;
 
