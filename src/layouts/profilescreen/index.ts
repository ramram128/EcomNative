import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
import ProfileScreenModern from './ProfileScreenModern';

type HomeLayoutProps = any;

const ProfileMap: Record<LayoutType, React.FC<HomeLayoutProps>> = {
  crystal: ProfileScreenModern,
  modern: ProfileScreenModern,
};

export const SelectedProfileScreenLayout = ProfileMap[ACTIVE_LAYOUT];