'use strict';

module.exports = (sequelize, DataTypes) => {
  const devices = sequelize.define('devices', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    stax_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_key: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  devices.dummyData = [
    {
      id: 1,
      stax_id: 'aaa:bbb',
      device_id: 'aa:bb:cc:ee',
      public_key: 'qweqweqeqeqweqweqweqw'
    }
  ];

  return devices;
};
