import { Icon, IconButton } from '@repo/ui/atoms';

const projectDashboardCardConfig = (
  ButtonWrapper: React.ComponentType<{ children: React.ReactNode }>,
) => ({
  title: 'projects_card_title',
  content: 'projects_card_content',
  titleControls: {
    plusCircle: (
      <ButtonWrapper>
        <IconButton
          type="button"
          className="hover:bg-transparent p-0"
          ariaLabel="Create Project"
        >
          <Icon name={'plusCircle'} />
        </IconButton>
      </ButtonWrapper>
    ),
  },
});

export default projectDashboardCardConfig;
