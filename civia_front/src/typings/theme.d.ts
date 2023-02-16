import { FlattenSimpleInterpolation } from 'styled-components';

import { colors, components } from '@src/theme/index';

export type Color = string
export type Colors = typeof colors
export type Components = typeof components

declare module 'styled-components' {
    export interface DefaultTheme extends Colors, Components {

    }
}
