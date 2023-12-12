/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Euler, Vector2, Vector3 } from 'three';

export const VERSION = '0.0.1';

export const DEFAULT_FOV = 45;
export const DEFAULT_SHADOW_CAMERA_FAR = 10000;
export const DEFAULT_SHADOW_MAP_SIZE = 4096;

export const UNDO_SHOW_INFO_DURATION = 0.5;

export const HALF_PI = Math.PI / 2;

export const TWO_PI = Math.PI * 2;

export const ZERO_TOLERANCE = 0.0001;

export const UNIT_VECTOR_POS_Z_ARRAY = [0, 0, 1];

export const UNIT_VECTOR_NEG_Y_ARRAY = [0, -1, 0];

export const UNIT_VECTOR_POS_X = new Vector3(1, 0, 0);

export const UNIT_VECTOR_NEG_X = new Vector3(-1, 0, 0);

export const UNIT_VECTOR_POS_Y = new Vector3(0, 1, 0);

export const UNIT_VECTOR_NEG_Y = new Vector3(0, -1, 0);

export const UNIT_VECTOR_POS_Z = new Vector3(0, 0, 1);

export const UNIT_VECTOR_NEG_Z = new Vector3(0, 0, -1);

export const ORIGIN_VECTOR2 = new Vector2(0, 0);

export const ORIGIN_VECTOR3 = new Vector3(0, 0, 0);

export const HALF_PI_Z_EULER = new Euler(0, 0, HALF_PI);

export const REGEX_ALLOWABLE_IN_NAME = /^[A-Za-z0-9\s-_()!?%&,]*$/;
