import { objectQuery } from 'services/helpers';

export function getIcon(plugin) {
  const iconMap = {
    script: 'icon-script',
    scriptfilter: 'icon-scriptfilter',
    twitter: 'icon-twitter',
    cube: 'icon-cube',
    data: 'fa-database',
    database: 'icon-database',
    table: 'icon-table',
    kafka: 'icon-kafka',
    jms: 'icon-jms',
    projection: 'icon-projection',
    amazonsqs: 'icon-amazonsqs',
    datagenerator: 'icon-datagenerator',
    validator: 'icon-validator',
    corevalidator: 'corevalidator',
    logparser: 'icon-logparser',
    file: 'icon-file',
    kvtable: 'icon-kvtable',
    s3: 'icon-s3',
    s3avro: 'icon-s3avro',
    s3parquet: 'icon-s3parquet',
    snapshotavro: 'icon-snapshotavro',
    snapshotparquet: 'icon-snapshotparquet',
    tpfsavro: 'icon-tpfsavro',
    tpfsparquet: 'icon-tpfsparquet',
    sink: 'icon-sink',
    hive: 'icon-hive',
    structuredrecordtogenericrecord: 'icon-structuredrecord',
    cassandra: 'icon-cassandra',
    teradata: 'icon-teradata',
    elasticsearch: 'icon-elasticsearch',
    hbase: 'icon-hbase',
    mongodb: 'icon-mongodb',
    pythonevaluator: 'icon-pythonevaluator',
    csvformatter: 'icon-csvformatter',
    csvparser: 'icon-csvparser',
    clonerecord: 'icon-clonerecord',
    compressor: 'icon-compressor',
    decompressor: 'icon-decompressor',
    encoder: 'icon-encoder',
    decoder: 'icon-decoder',
    jsonformatter: 'icon-jsonformatter',
    jsonparser: 'icon-jsonparser',
    hdfs: 'icon-hdfs',
    hasher: 'icon-hasher',
    javascript: 'icon-javascript',
    deduper: 'icon-deduper',
    distinct: 'icon-distinct',
    naivebayestrainer: 'icon-naivebayestrainer',
    groupbyaggregate: 'icon-groupbyaggregate',
    naivebayesclassifier: 'icon-naivebayesclassifier',
    azureblobstore: 'icon-azureblobstore',
    xmlreader: 'icon-XMLreader',
    xmlparser: 'icon-XMLparser',
    ftp: 'icon-FTP',
    joiner: 'icon-joiner',
    deduplicate: 'icon-deduplicator',
    valuemapper: 'icon-valuemapper',
    rowdenormalizer: 'icon-rowdenormalizer',
    ssh: 'icon-ssh',
    sshaction: 'icon-sshaction',
    copybookreader: 'icon-COBOLcopybookreader',
    excel: 'icon-excelinputsource',
    encryptor: 'icon-Encryptor',
    decryptor: 'icon-Decryptor',
    hdfsfilemoveaction: 'icon-filemoveaction',
    hdfsfilecopyaction: 'icon-filecopyaction',
    sqlaction: 'icon-SQLaction',
    impalahiveaction: 'icon-impalahiveaction',
    email: 'icon-emailaction',
    kinesissink: 'icon-Amazon-Kinesis',
    bigquerysource: 'icon-Big-Query',
    tpfsorc: 'icon-ORC',
    groupby: 'icon-groupby',
    sparkmachinelearning: 'icon-sparkmachinelearning',
    solrsearch: 'icon-solr',
    sparkstreaming: 'icon-sparkstreaming',
    rename: 'icon-rename',
    archive: 'icon-archive',
    wrangler: 'icon-DataPreparation',
    normalize: 'icon-normalize',
    xmlmultiparser: 'icon-XMLmultiparser',
    xmltojson: 'icon-XMLtoJSON',
    decisiontreepredictor: 'icon-decisiontreeanalytics',
    decisiontreetrainer: 'icon-DesicionTree',
    hashingtffeaturegenerator: 'icon-HashingTF',
    ngramtransform: 'icon-NGram',
    tokenizer: 'icon-tokenizeranalytics',
    skipgramfeaturegenerator: 'icon-skipgram',
    skipgramtrainer: 'icon-skipgramtrainer',
    logisticregressionclassifier: 'icon-logisticregressionanalytics',
    logisticregressiontrainer: 'icon-LogisticRegressionclassifier',
    hdfsdelete: 'icon-hdfsdelete',
    hdfsmove: 'icon-hdfsmove',
    windowssharecopy: 'icon-windowssharecopy',
    httppoller: 'icon-httppoller',
    window: 'icon-window',
    run: 'icon-Run',
    oracleexport: 'icon-OracleDump',
    snapshottext: 'icon-SnapshotTextSink',
    errorcollector: 'fa-exclamation-triangle',
    mainframereader: 'icon-MainframeReader',
    fastfilter: 'icon-fastfilter',
    trash: 'icon-TrashSink',
    staterestore: 'icon-Staterestore',
    topn: 'icon-TopN',
    wordcount: 'icon-WordCount',
    datetransform: 'icon-DateTransform',
    sftpcopy: 'icon-FTPcopy',
    sftpdelete: 'icon-FTPdelete',
    validatingxmlconverter: 'icon-XMLvalidator',
    wholefilereader: 'icon-Filereader',
    xmlschemaaction: 'icon-XMLschemagenerator',
    s3toredshift: 'icon-S3toredshift',
    redshifttos3: 'icon-redshifttoS3',
    verticabulkexportaction: 'icon-Verticabulkexport',
    verticabulkimportaction: 'icon-Verticabulkload',
    loadtosnowflake: 'icon-snowflake',
    kudu: 'icon-apachekudu',
    orientdb: 'icon-OrientDB',
    recordsplitter: 'icon-recordsplitter',
    scalasparkprogram: 'icon-spark',
    scalasparkcompute: 'icon-spark',
    cdcdatabase: 'icon-database',
    cdchbase: 'icon-hbase',
    cdckudu: 'icon-apachekudu',
    changetrackingsqlserver: 'icon-database',
    conditional: 'fa-question-circle-o',
  };

  const pluginName = plugin ? plugin.toLowerCase() : '';
  const icon = iconMap[pluginName] ? iconMap[pluginName] : 'fa-plug';
  return icon;
}

export function getPluginDisplayName(plugin) {
  const displayName = objectQuery(plugin, 'widgetJson', 'display-name');
  const pluginName = objectQuery(plugin, 'name') || '';
  return displayName ? displayName : pluginName;
}

export const parseJdbcString = (connectionString: string, databaseType: string) => {
  const type1 = [
    'postgres',
    'netezza',
    'mysql',
    'memsql',
    'mariadb',
    'db2',
    'aurora-postgres',
    'aurora-mysql',
    'oracle',
    'cloudsql-mysql',
    'cloudsql-postgresql',
  ];
  const type2 = [,];
  if (type1.includes(databaseType)) {
    return connectionString.split('/')[3];
  }
  if (databaseType === 'sqlserver') {
    return connectionString
      .split('/')[2]
      .split(';')[1]
      .split('=')[1];
  }
  if (databaseType === 'teradata') {
    return connectionString
      .split('/')[3]
      .split(' ')[0]
      .split('=')[1]
      .split(',')[0];
  }
  if (databaseType === 'saphana') {
    return connectionString.split('/')[2].split(':')[1];
  }
};
