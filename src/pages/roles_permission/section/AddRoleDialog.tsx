import { Box, Button, CustomDialog, FormInput, FormSelect, Text } from '@/atoms';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRole } from '../RoleContex';
import { Roles } from '@/types/common.type';
import { useMasterData } from '@/pages/settings/setups/masterCotext';

const addRoleScheam = z.object({
  roleName: z.string().nonempty('Role Name is required'),
  roleType: z.number().min(1, 'Role Type is required')
});
type AddRoleForm = z.infer<typeof addRoleScheam>;

interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
  isEditDialog?: boolean;
  roleData?: Roles;
  isDeleteDialog?: boolean;
}

const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onClose,
  isEditDialog = false,
  isDeleteDialog = false,
  roleData
}) => {
  const {
    action: { getRoles }
  } = useMasterData();
  const {
    state: { organizationTypes },
    actions: { createRole }
  } = useRole();
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(addRoleScheam),
    defaultValues: {
      roleName: '',
      roleType: 0
    }
  });
  useEffect(() => {
    reset({ roleName: roleData?.name, roleType: roleData?.roleType === 'Transtan' ? 1 : 2 });
    console.log('role name ', roleData);
  }, [roleData]);
  const onSubmit = (data: AddRoleForm) => {
    const FormattedRoleType = data.roleType === 1 ? 'Transtan' : 'Hospital';
    const payload = {
      id: roleData?.id ?? 0,
      name: data.roleName,
      roleType: FormattedRoleType,
      isActive: isDeleteDialog ? false : true,
      rolePermissions: []
    };
    createRole(payload, () => {
      toast(
        `${data.roleName} Role ${payload.id === 0 ? 'Added' : isDeleteDialog ? 'Inactivated' : 'Updated'} Successfully`,
        'success'
      );
      getRoles({ _all: true });
    });

    onClose();
    reset({ roleName: '', roleType: 0 });
  };
  useEffect(() => {
    if (!open) {
      reset({ roleName: '', roleType: 0 });
    }
  }, [!open]);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        {isDeleteDialog ? (
          <Box>
            <Text className="text-[#A1999F] !text-[16px] !font-[500] flex gap-2 items-center">
              Are you sure want to make this Role<Text className="text-[red]">Inactive? </Text>
            </Text>
            <Text className="!text-[16px] !font-[500] flex gap-2 items-center">
              <Text className="text-[#A1999F]"> Role:</Text> {roleData?.name}
              <Text className="text-[#A1999F]"> Role Type:</Text> {roleData?.roleType}
            </Text>
            <Box mt={3} className="flex items-center justify-center gap-4">
              <Button className="" variant="outlined" onClick={onClose}>
                No
              </Button>
              <Button type="submit" className="" variant="contained" onClick={handleSubmit(onSubmit)}>
                Yes
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Text className="!mb-[24px] !text-[19px] !font-[500] ">{isEditDialog ? 'Edit Role' : 'Add New Role'}</Text>
            <FormSelect
              className="!mb-[24px]"
              menuOptions={organizationTypes}
              control={control}
              name="roleType"
              label="Role Type"
              fullWidth
              required
            />
            <FormInput label="Role Nmae" control={control} name="roleName" fullWidth required />
            <Box className="flex gap-4 items-center justify-between mt-[24px]">
              <Button className="w-full" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button className="w-full" variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </Box>
        )}
      </form>
    </CustomDialog>
  );
};

export default AddRoleDialog;
