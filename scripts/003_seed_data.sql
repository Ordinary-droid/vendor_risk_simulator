-- Seed data for Vendor Risk Platform
-- Insert sample vendors

insert into public.vendors (name, category, status, security_rating, compliance_nist, compliance_iso27001, compliance_soc2, compliance_gdpr, contract_value, data_access_level, contact_email, contact_name, last_assessment, next_assessment)
values
  ('CloudCore Systems', 'cloud', 'active', 92, true, true, true, true, 250000.00, 'high', 'security@cloudcore.io', 'Sarah Chen', now() - interval '30 days', now() + interval '335 days'),
  ('DataFlow Analytics', 'data', 'active', 78, true, false, true, true, 85000.00, 'critical', 'compliance@dataflow.com', 'Mike Johnson', now() - interval '60 days', now() + interval '305 days'),
  ('SecureAuth Pro', 'security', 'active', 95, true, true, true, true, 120000.00, 'high', 'support@secureauth.io', 'Emily Davis', now() - interval '15 days', now() + interval '350 days'),
  ('CommLink Enterprise', 'communication', 'active', 71, false, true, false, true, 45000.00, 'medium', 'admin@commlink.net', 'Tom Wilson', now() - interval '90 days', now() + interval '275 days'),
  ('InfraTech Solutions', 'infrastructure', 'under_review', 65, true, false, false, false, 180000.00, 'high', 'ops@infratech.co', 'Lisa Brown', now() - interval '120 days', now() + interval '245 days'),
  ('SaaSify Platform', 'saas', 'active', 88, true, true, true, true, 95000.00, 'medium', 'security@saasify.io', 'James Lee', now() - interval '45 days', now() + interval '320 days'),
  ('NetGuard Security', 'security', 'active', 91, true, true, true, true, 200000.00, 'critical', 'ciso@netguard.com', 'Amanda White', now() - interval '20 days', now() + interval '345 days'),
  ('CloudVault Storage', 'cloud', 'active', 84, true, true, true, true, 150000.00, 'critical', 'support@cloudvault.io', 'Robert Garcia', now() - interval '50 days', now() + interval '315 days'),
  ('APIConnect Hub', 'saas', 'inactive', 58, false, false, true, false, 35000.00, 'low', 'tech@apiconnect.com', 'Kevin Martinez', now() - interval '180 days', now() + interval '185 days'),
  ('DataSync Pro', 'data', 'active', 76, true, false, true, true, 72000.00, 'high', 'admin@datasync.io', 'Jennifer Taylor', now() - interval '75 days', now() + interval '290 days'),
  ('EdgeCompute Networks', 'infrastructure', 'active', 82, true, true, false, true, 220000.00, 'high', 'security@edgecompute.net', 'David Anderson', now() - interval '40 days', now() + interval '325 days'),
  ('ChatOps Central', 'communication', 'blocked', 42, false, false, false, false, 25000.00, 'low', 'support@chatops.co', 'Nancy Thomas', now() - interval '200 days', now() - interval '35 days');

-- Insert sample incidents
insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems)
select 
  v.id,
  'API Rate Limiting Issue',
  'Unexpected rate limiting affecting production workloads during peak hours.',
  'medium',
  'resolved',
  'service_outage',
  array['API Gateway', 'Load Balancer']
from public.vendors v where v.name = 'CloudCore Systems';

insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems, resolved_at)
select 
  v.id,
  'Data Processing Delay',
  'Batch processing jobs experiencing significant delays due to infrastructure issues.',
  'high',
  'resolved',
  'service_outage',
  array['ETL Pipeline', 'Data Warehouse'],
  now() - interval '5 days'
from public.vendors v where v.name = 'DataFlow Analytics';

insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems)
select 
  v.id,
  'SSL Certificate Expiry Warning',
  'SSL certificates for API endpoints approaching expiration date.',
  'low',
  'mitigating',
  'security_vulnerability',
  array['API Endpoints']
from public.vendors v where v.name = 'CommLink Enterprise';

insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems)
select 
  v.id,
  'SOC 2 Compliance Gap',
  'Missing documentation for access control procedures identified during audit.',
  'high',
  'investigating',
  'compliance_violation',
  array['Access Management', 'Documentation']
from public.vendors v where v.name = 'InfraTech Solutions';

insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems)
select 
  v.id,
  'Unauthorized Access Attempt',
  'Multiple failed login attempts detected from suspicious IP addresses.',
  'critical',
  'open',
  'security_vulnerability',
  array['Authentication System', 'Firewall']
from public.vendors v where v.name = 'APIConnect Hub';

insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems, resolved_at)
select 
  v.id,
  'Data Breach Investigation',
  'Potential data exposure identified during routine security audit. Customer PII may have been accessed.',
  'critical',
  'closed',
  'data_breach',
  array['Customer Database', 'Backup Systems'],
  now() - interval '15 days'
from public.vendors v where v.name = 'ChatOps Central';

insert into public.incidents (vendor_id, title, description, severity, status, incident_type, affected_systems)
select 
  v.id,
  'Performance Degradation',
  'Response times increased by 40% over the past week.',
  'medium',
  'investigating',
  'service_outage',
  array['Application Servers', 'Database']
from public.vendors v where v.name = 'SaaSify Platform';
