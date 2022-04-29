import { en } from 'constants/lang';
import { frontFacingFirst, rightFacingFirst, leftFacingFirst } from 'assets/images';

const { FRONT_FACE_LABEL, RIGHT_FACE_LABEL, LEFT_FACE_LABEL } = en.sampleImage;

export const sampleImages = [
  {
    srcUrl: frontFacingFirst,
    id: '0',
    groupByName: FRONT_FACE_LABEL,
  },
  {
    srcUrl: rightFacingFirst,
    id: '1',
    groupByName: RIGHT_FACE_LABEL,
  },
  {
    srcUrl: leftFacingFirst,
    id: '2',
    groupByName: LEFT_FACE_LABEL,
  },
];
