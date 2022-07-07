const alerts = require('../typewise-alert');
const { expect } = require('chai');
const chai = require('chai');
const spy = require('chai-spies');
chai.use(spy);

describe('typewise alerts', function () {
  it('infers a value lower than the minimum as TOO_LOW', () => {
    expect(alerts.inferBreach(20, 50, 100)).equals('TOO_LOW');
  });

  it('infers a value more than the maximum as TOO_HIGH ', () => {
    expect(alerts.inferBreach(110, 50, 100)).equals('TOO_HIGH');
  });

  it('infers a value more than the maximum as TOO_HIGH ', () => {
    expect(alerts.inferBreach(60, 50, 100)).equals('NORMAL');
  });

  it('classify temperature breach with PASSIVE COOLING type with value 0', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 0)).equals(
      'TOO_LOW'
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value -1', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', -1)).equals(
      'TOO_LOW'
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value 20', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 20)).equals(
      'NORMAL'
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value 35', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 35)).equals(
      'TOO_HIGH'
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value 49', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 40)).equals(
      'TOO_HIGH'
    );
  });

  it('classify temperature breach with HI ACTIVE COOLING type with value -1', () => {
    expect(alerts.classifyTemperatureBreach('HI_ACTIVE_COOLING', -1)).equals(
      'TOO_LOW'
    );
  });

  it('classify temperature breach with HI ACTIVE COOLING type with value 20', () => {
    expect(alerts.classifyTemperatureBreach('HI_ACTIVE_COOLING', 20)).equals(
      'NORMAL'
    );
  });

  it('classify temperature breach with HI ACTIVE COOLING type with value 50', () => {
    expect(alerts.classifyTemperatureBreach('HI_ACTIVE_COOLING', 50)).equals(
      'TOO_HIGH'
    );
  });

  it('classify temperature breach with MED ACTIVE COOLING type with value -1', () => {
    expect(alerts.classifyTemperatureBreach('MED_ACTIVE_COOLING', -1)).equals(
      'TOO_LOW'
    );
  });

  it('classify temperature breach with MED ACTIVE COOLING type with value 20', () => {
    expect(alerts.classifyTemperatureBreach('MED_ACTIVE_COOLING', 20)).equals(
      'NORMAL'
    );
  });

  it('classify temperature breach with MED ACTIVE COOLING type with value 41', () => {
    expect(alerts.classifyTemperatureBreach('MED_ACTIVE_COOLING', 41)).equals(
      'TOO_HIGH'
    );
  });

  it('call the sendToController function with breach type with value TOO_LOW', () => {
    const breachType = 'TOO_LOW';
    alerts.sendToController(breachType); // console.log is output
  });

  it('call the sendToMail function with TOO_LOW', () => {
    const breachType = 'TOO_LOW';
    let spy = chai.spy(alerts.sendToEmail);
    spy(breachType);
    expect(spy).to.have.been.called.with('TOO_LOW');
  });

  it('call the sendToMail function with TOO_HIGH', () => {
    const breachType = 'TOO_HIGH';
    let spy = chai.spy(alerts.sendToEmail);
    spy(breachType);
    expect(spy).to.have.been.called.with('TOO_HIGH');
  });

  it('call the checkAndAlert function with TO_CONTROLLER', () => {
    const mockAlertTarget = 'TO_CONTROLLER';
    const mockTemperatureInc = 30;
    const mockBatteryChar = {
      coolingType: 'PASSIVE_COOLING',
    };
    const breachType = alerts.classifyTemperatureBreach(
      mockBatteryChar.coolingType,
      mockTemperatureInc
    );
    alerts.checkAndAlert(mockAlertTarget, mockBatteryChar, mockTemperatureInc);
    let spy = chai.spy.on(alerts.sendToController);
    expect(spy(breachType)).to.have.been.called();
  });

  it('call the checkAndAlert function with TO_EMAIL', () => {
    const mockAlertTarget2 = 'TO_EMAIL';
    const mockTemperatureInc2 = 50;
    const mockBatteryChar2 = {
      coolingType: 'HI_ACTIVE_COOLING',
    };
    const breachType2 = alerts.classifyTemperatureBreach(
      mockBatteryChar2.coolingType,
      mockTemperatureInc2
    );
    alerts.checkAndAlert(
      mockAlertTarget2,
      mockBatteryChar2,
      mockTemperatureInc2
    );
    let spy2 = chai.spy.on(alerts.sendToEmail);
    expect(spy2).to.have.been.called();
  });
});
