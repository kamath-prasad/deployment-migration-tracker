- Following things need to be tracked for each bosh deployment that would be migrated .

1. Deployment Name.
2. Deployment Manifest.
3. VM to Disk Mapping.
4. Logs of migration.
5. Time Taken
6. Status

For the initial version of this App , all the above attributes will be maintained in a single collection in MongoDB.

- MigrationDetails
{
  name,
  old_bosh,
  new_bosh,
  manifest,
  vm_disk_mapping
  {
    vm_id : disk_id
  },
  logs,
  status,
  time_taken,
  created_at,
  updated_at
}