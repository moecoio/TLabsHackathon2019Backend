
'use strict';

module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stax_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  messages.dummyData = [
    {
      id: 1,
      device_id: 'aa:bb:cc',
      stax_id: 'asdfghjl'
    }
  ];

  return messages;
};
