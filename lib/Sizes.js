
import { Dimensions, PixelRatio } from 'react-native';

/** all base values are with iPhone 6 (375 by 667) with pixelRatio 2 */

// Dimensions:
// iPhone 2-4 : 320 × 480
// iPhone 5   : 320 × 568
// iPhone 6-7 : 375 × 667
// iPhone 6-7+: 414 × 736
// iPhone X   : 375 x 812,  pixelRatio=3

// Pixel Ratio: PixelRatio.get() === 1
/*mdpi Android devices (160 dpi)
PixelRatio.get() === 1.5
hdpi Android devices (240 dpi)
PixelRatio.get() === 2
iPhone 4, 4S
iPhone 5, 5c, 5s
iPhone 6
xhdpi Android devices (320 dpi)
PixelRatio.get() === 3
iPhone 6 plus
xxhdpi Android devices (480 dpi)
PixelRatio.get() === 3.5
Nexus 6
*/

class Sizes {

  constructor() {

    if (!Sizes.instance) {

      let {height, width} = Dimensions.get('window');
      let pixelRatio = PixelRatio.get();
      this.height = height;
      this.width = width;
      this.pixelRatio = pixelRatio;
      Sizes.instance = this;
    }
    return Sizes.instance;
  }

  extraHeightFromIphoneX() {
    // for this width, calc height by using 16/9. That's regular phones.
    let targetedHeight = 16.0 * this.width / 9.0;
    let leftovers = this.height - targetedHeight;
    return (leftovers / 2.0);
  }

  calcFromHeight(value) {
    return value * (this.height / 667.0);// * (this.pixelRatio / 2);
  }

  calcFromWidth(value) {
    return value * (this.width / 375.0);// * (2 / this.pixelRatio);
  }

  round(value) {
    return Math.round(value)
  }

  halfWidth() {
    return 0.5 * this.width;
  }

  fullWidth() {
    return this.width;
  }

  fullHeight() {
    return this.height;
  }
}

const instance = new Sizes();
Object.freeze(instance);

export default instance;
