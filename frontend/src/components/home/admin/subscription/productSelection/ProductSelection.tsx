import * as React from 'react';
import { customize, customize2 } from 'assets/images';
import Button from 'components/common/button';
import parse from 'html-react-parser';

import { en } from 'constants/lang';
import HeaderLine from 'components/common/HeaderLine';
import { useHistory, useLocation } from 'react-router-dom';
import { ADMIN_USER_PRODUCT_PAYMENT_INFORMATION, ADMIN_USER_REGISTRATION } from 'constants/routes';
import { IAddonOrder, productCategory } from 'types/shoppingCart';
import ContentLoader from 'react-content-loader';
import UserDetailsCard from '../UserDetailsCard';
import { IAdminLead, IAdminProductSelectionProps } from 'types/admin';
import { handleError } from 'utils/errorHandler';
import { getLeadFromId } from 'services/users';
import useMountedRef from 'hooks/useMountedRef';

const { CUSTOMIZE_ORDER } = en.addon;

const replace = (domNode: any) => {
  domNode.attribs = {};

  return domNode;
};

const INITIAL_IADMINLEAD: IAdminLead = {
  email: '',
  name: '',
  attributes: { type: '', url: '' },
  dOB: '',
  firstName: '',
  homeState: '',
  iagreetoNoPPandTOA: false,
  iagreetoreceivefrequentmarketing: false,
  id: '',
  lastName: '',
  phone: '',
  status: '',
};

/**
 * Main ProductSelection component.
 *
 */
const ProductSelection: React.FunctionComponent<IAdminProductSelectionProps> = ({
  setOrders,
  orders,
  isAddonLoaded,
  addonConfigurations,
}) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [lead, setLead] = React.useState<IAdminLead>(INITIAL_IADMINLEAD);
  const spotTreatmentAddon = addonConfigurations.SpotTreatment[0];
  const mountRef = useMountedRef();

  // fetch query from url
  const useQueryString = () => {
    const location = useLocation();

    return new URLSearchParams(location.search);
  };

  const queryString = useQueryString();
  const leadId = queryString.get('id') as string;

  // redirect if no id query parameter
  if (!leadId) {
    history.push(`${ADMIN_USER_REGISTRATION}`);
  }

  const toggleSpotTreatmentSelection = () => {
    if (spotTreatmentAddon) {
      const newCart = orders.map(item => {
        if (item.name === spotTreatmentAddon.name) {
          return {
            ...item,
            isSelected: !item.isSelected,
          };
        }

        return item;
      });

      setOrders(newCart);
    }
  };

  // reset orders for new user
  const resetSpotTreatmentSelection = () => {
    if (isAddonLoaded) {
      const spotTreatmentAddon = addonConfigurations.SpotTreatment[0];

      const newCart = orders.map(item => {
        if (item.name === spotTreatmentAddon.name) {
          return {
            ...item,
            isSelected: false,
          };
        }

        return item;
      });

      setOrders(newCart);
    }
  };

  const hasSpotTreatment = () => {
    const spotTreatmentAddon = addonConfigurations?.SpotTreatment[0];
    const spotCream = orders.find(item => item.name === spotTreatmentAddon.name && item.isSelected);

    return !!spotCream;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getLeadFromId(leadId);

        if (mountRef.current) {
          const leadData: IAdminLead = data.data;

          setLead(leadData);
          setIsLoading(false);
        }
      } catch (error) {
        handleError(error, { title: 'Invalid user', message: 'Please start over' });
        history.push(ADMIN_USER_REGISTRATION);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeaderLine />
      <div className="product-selection container">
        <div className="mt-10x product-selection-wrapper">
          <UserDetailsCard isReady={!isLoading} lead={lead} resetSpotTreatmentSelection={resetSpotTreatmentSelection} />
          <h1 className="mb-10x mt-10x">Product selection</h1>
          {/* first card */}
          <div className="full-face-prescription-wrapper mt-8x">
            <img src={customize}></img>
            <div className="full-face-description p-5x">
              <div className="d-flex flex-column flex-row-sm">
                <div className="full-face-price-wrapper mb-4x mb-0x-sm">
                  <h4 className="full-face-header mb-2x">{CUSTOMIZE_ORDER.FULL_FACE_PRESCRIPTION_HEADER}</h4>
                  <div className="pr-15x">
                    <p>{CUSTOMIZE_ORDER.PRODUCT_DESC}</p>
                  </div>
                </div>

                <div className="full-face-description-wrapper d-flex flex-column align-items-start align-items-end-sm">
                  <span className="full-face-cost discounted strikethrough">{CUSTOMIZE_ORDER.FULL_FACE_PRICE}</span>
                  <div className="full-face-free">{CUSTOMIZE_ORDER.FIRST_MONTH_FREE}</div>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-6x">
                <div className="full-face-button customize-product-added">{CUSTOMIZE_ORDER.PRODUCT_REQUIRED}</div>
              </div>
            </div>
          </div>
          {/* second card */}
          <div className="full-face-prescription-wrapper mt-8x">
            <img src={customize2}></img>
            {addonConfigurations && isAddonLoaded ? (
              <div
                className="full-face-description-small pl-5x pb-5x pr-5x pt-5x"
                style={{ border: '1px solid #C4C4C4' }}
              >
                <div className="d-flex flex-column flex-row-sm">
                  <div className="full-face-product-wrapper mb-4x mb-0x-sm">
                    <h4 className="full-face-header mb-2x">{addonConfigurations.SpotTreatment[0].name}</h4>
                    <div className="pr-15x">
                      {parse(addonConfigurations.SpotTreatment[0].description || '', { replace })}
                    </div>
                  </div>

                  <div className="full-face-description-wrapper">
                    <div className="full-face-price-wrapper d-flex justify-content-end-sm">
                      <span className="full-face-cost discounted strikethrough mr-5x">
                        ${addonConfigurations.SpotTreatment[0].standardPrice}
                      </span>
                      <div className="full-face-cost">${addonConfigurations.SpotTreatment[0].trialPrice}</div>
                    </div>
                    <div className="full-face-free">{CUSTOMIZE_ORDER.SAVE_WITH_BUNDLE}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="full-face-button customize-product-added">
                    {hasSpotTreatment() ? (
                      <div className="d-flex justify-content-center align-items-center mt-6x">
                        <span className="mr-4x">{CUSTOMIZE_ORDER.PRODUCT_ADDED}</span>
                        <Button
                          color="ghost"
                          onClick={toggleSpotTreatmentSelection}
                          className="full-face-button remove"
                        >
                          {CUSTOMIZE_ORDER.REMOVE}
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center mt-6x">
                        <Button color="ghost" onClick={toggleSpotTreatmentSelection} className="full-face-button add">
                          {CUSTOMIZE_ORDER.ADD}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <ContentLoader viewBox="0 0 100 10">
                <rect x="0" y="0" width="100" height="10" />
              </ContentLoader>
            )}{' '}
          </div>
          {/* buttons */}
          <div className="row mt-10x">
            <div className="col-12-md mb-4x">
              <Button
                title="Confirm and continue to payment"
                onClick={() => {
                  history.push(`${ADMIN_USER_PRODUCT_PAYMENT_INFORMATION}?id=${leadId}`);
                }}
                fullWidth
              />
              <Button
                type="button"
                title="Back to user registration"
                fullWidth
                color="black-text"
                onClick={() => {
                  history.push(`${ADMIN_USER_REGISTRATION}${leadId ? `?id=${leadId}` : null}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSelection;
