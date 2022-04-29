"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OUTBOUND_ACK_XML = void 0;
exports.OUTBOUND_ACK_XML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
<soapenv:Body>
<notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
<Ack>true</Ack>
</notificationsResponse>
</soapenv:Body>
</soapenv:Envelope>`;
