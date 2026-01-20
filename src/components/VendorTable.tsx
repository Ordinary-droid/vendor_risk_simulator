import type { Vendor } from '@/engine/types';

interface Props {
  vendors: Vendor[];
}

export default function VendorTable({ vendors }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Tier</th>
          <th>Access</th>
          <th>Inherent Risk</th>
          <th>Security</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {vendors.map(v => (
          <tr key={v.id}>
            <td>{v.name}</td>
            <td>{v.tier}</td>
            <td>{v.accessLevel}</td>
            <td>{v.inherentRisk}</td>
            <td>{v.securityRating}</td>
            <td>{v.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
