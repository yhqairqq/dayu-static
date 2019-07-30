import Db2Formatter from './languages/Db2Formatter';
import N1qlFormatter from './languages/N1qlFormatter';
import PlSqlFormatter from './languages/PlSqlFormatter';
import StandardSqlFormatter from './languages/StandardSqlFormatter';

export default {
  /**
   * Format whitespaces in a query to make it easier to read.
   *
   * @param {String} query
   * @param {Object} cfg
   *  @param {String} cfg.language Query language, default is Standard SQL
   *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
   *  @param {Object} cfg.params Collection of params for placeholder replacement
   * @return {String}
   */
  format: (query, cfg) => {
    const localCfg = cfg || {};

    switch (localCfg.language) {
      case 'db2':
        return new Db2Formatter(localCfg).format(query);
      case 'n1ql':
        return new N1qlFormatter(localCfg).format(query);
      case 'pl/sql':
        return new PlSqlFormatter(localCfg).format(query);
      case 'sql':
      case undefined:
        return new StandardSqlFormatter(localCfg).format(query);
      default:
        throw Error(`Unsupported SQL dialect: ${localCfg.language}`);
    }
  },
};
