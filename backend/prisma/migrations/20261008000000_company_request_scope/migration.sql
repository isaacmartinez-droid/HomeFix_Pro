-- Keep company assignments separate from a technician's independent work.
ALTER TABLE "ServiceRequest" ADD COLUMN "companyId" INTEGER REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "ServiceRequest_companyId_status_idx" ON "ServiceRequest"("companyId", "status");
CREATE INDEX "ServiceRequest_clientId_status_idx" ON "ServiceRequest"("clientId", "status");
CREATE INDEX "ServiceRequest_technicianId_status_idx" ON "ServiceRequest"("technicianId", "status");
