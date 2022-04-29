import * as React from 'react';
import { plan1, plan2, iconMorning, iconEvening, iconAnytime, iconFormula, iconChevronRight } from 'assets/images';

const UserDashboard = () => {
  return (
    <div className="container">
      <div className="user-plan-section">
        <div className="user-plan-header mb-10x mt-10x mt-sm-0x">
          <div className="d-flex flex-wrap justify-content-between-sm align-items-center font-weight-bold">
            <h2 className="mb-4x mb-0x-sm">Your plan</h2>
            <p>
              Facing any challenges?{' '}
              <a href="#" className="custom-link ml-4x">
                Get in touch
              </a>
            </p>
          </div>
        </div>
        <div className="user-plan-main">
          <div className="user-plan-item pl-8x">
            <p className="user-plan-period">January 2021 - March 2021</p>
            <div className="user-plan-detail pb-8x mb-8x">
              <div className="row">
                <div className="col-8-md col-6-sm">
                  <div className="row">
                    <div className="col-6-md">
                      <div className="user-plan-goal mb-8x">
                        <h3 className="mb-4x">Goals</h3>
                        <ol className="pl-6x">
                          <li className="mb-3x">Heal current breakouts and prevent future ones from occuring</li>
                          <li className="mb-3x">Begin to fade dark spots and scarring from past breakouts</li>
                          <li className="mb-3x">Introduce skin to anti-aging properties</li>
                        </ol>
                      </div>
                    </div>
                    <div className="col-6-md">
                      <div className="user-plan-regimen mb-6x pr-8x">
                        <h3 className="mb-4x">Regimen</h3>
                        <div className="regimen-detail">
                          <div className="regimen-item">
                            <h5 className="mb-2x d-flex align-items-center">
                              <img src={iconEvening} className="mr-2x mt-1x icon-evening" />
                              Evening
                            </h5>
                            <ul className="pl-6x">
                              <li className="mb-2x">
                                <a href="#" className="custom-link">
                                  Tretinoin 0.025%, Hydroquinone 4%, Niacinamide 4%
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-12">
                      <img src={plan1} className="mr-2x" alt=""/>
                      <img src={plan2} className="mr-2x" alt=""/>
                      <img src={plan1} className="mr-2x" alt=""/>
                      <img src={plan2} className="mr-2x" alt=""/>
                    </div> */}
                  </div>
                </div>
                <div className="col-4-md col-6-sm">
                  <div className="user-plan-guidance mb-5x pr-8x">
                    <h3 className="mb-4x">Guidance</h3>
                    <div className="user-guidance-detail">
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Adjustment</h5>
                        <ul className="pl-6x">
                          <li className="mb-2x">Week 1 – Use 2 times per week.</li>
                          <li className="mb-2x">Week 2 – Use 3 times per week.</li>
                          <li className="mb-2x">Week 3 – Increase usage to 5 times per week.</li>
                          <li className="mb-2x">Week 4 – Use daily.</li>
                        </ul>
                      </div>
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Application</h5>
                        <ul className="pl-6x">
                          <li className="mb-2x">Step 1: In the evening, wash your face and pat dry.</li>
                          <li className="mb-2x">
                            Step 2: Apply a pea-size amount the face. Avoid the eye area, nasal creases, and corners of
                            mouth.
                          </li>
                          <li className="mb-2x">Step 3: Follow with a moisturizer.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="user-plan-item user-plan-item--active pl-8x">
            <p className="user-plan-period">March 2021 - April 2021</p>
            <div className="user-plan-detail pb-8x mb-8x">
              <div className="row">
                <div className="col-8-md col-6-sm">
                  <div className="row">
                    <div className="col-6-md">
                      <div className="user-plan-goal mb-8x">
                        <h3 className="mb-4x">Goals</h3>
                        <ol className="pl-6x">
                          <li className="mb-3x">
                            t’s important to take a break from hydroquinone so for the follow few months, we have
                            removed that from your compound
                          </li>
                          <li className="mb-3x">Continue to treat acne with an antibiotic</li>
                          <li className="mb-3x">Introduce a hydrator to alleviate any dryiness</li>
                        </ol>
                      </div>
                    </div>
                    <div className="col-6-md">
                      <div className="user-plan-regimen mb-6x pr-8x">
                        <h3 className="mb-4x">Regimen</h3>
                        <div className="regimen-detail">
                          <div className="regimen-item mb-5x">
                            <h5 className="mb-2x d-flex align-items-center">
                              <img src={iconMorning} className="mr-2x mt-1x icon-morning" />
                              Morning
                            </h5>
                            <ul className="pl-6x">
                              <li className="mb-2x">
                                <a href="#" className="custom-link d-flex align-items-start">
                                  <img src={iconFormula} className="mr-2x mt-1x" />
                                  Lactic Acid wash
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="regimen-item mb-5x">
                            <h5 className="mb-2x d-flex align-items-center">
                              <img src={iconEvening} className="mr-2x mt-1x icon-evening" />
                              Evening
                            </h5>
                            <ul className="pl-6x">
                              <li className="mb-2x">
                                <a href="#" className="custom-link d-flex align-items-start">
                                  <img src={iconFormula} className="mr-2x mt-1x" />
                                  Tretinoin 0.025%, Hydroquinone 4%, Niacinamide 4%
                                </a>
                              </li>
                              <li className="mb-2x">
                                <a href="#" className="custom-link d-flex align-items-start">
                                  <img src={iconFormula} className="mr-2x mt-1x" />
                                  Hydroquinone 4%, Tretinoin 0.05%, Hydrocortisone 2.5%
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="regimen-item mb-5x">
                            <h5 className="mb-2x d-flex align-items-center">
                              <img src={iconAnytime} className="mr-2x mt-1x" />
                              Any time
                            </h5>
                            <ul className="pl-6x">
                              <li className="mb-2x">
                                <a href="#" className="custom-link">
                                  Tretinoin 0.025%
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-12">
                      <img src={plan1} className="mr-2x" alt=""/>
                      <img src={plan2} className="mr-2x" alt=""/>
                      <img src={plan1} className="mr-2x" alt=""/>
                      <img src={plan2} className="mr-2x" alt=""/>
                    </div> */}
                  </div>
                </div>
                <div className="col-4-md col-6-sm">
                  <div className="user-plan-guidance mb-5x pr-8x">
                    <h3 className="mb-4x">Guidance</h3>
                    <div className="user-guidance-detail">
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Adjustment</h5>
                        <ul className="pl-6x">
                          <li className="mb-2x">Week 1 – Use 2 times per week.</li>
                          <li className="mb-2x">Week 2 – Use 3 times per week.</li>
                          <li className="mb-2x">Week 3 – Increase usage to 5 times per week.</li>
                          <li className="mb-2x">Week 4 – Use daily.</li>
                        </ul>
                      </div>
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Application</h5>
                        <ul className="pl-6x">
                          <li className="mb-2x">
                            In the morning, wash with your prescribed revea cleanser, followed by a moisturizer and SPF
                            30+.
                          </li>
                          <li className="mb-2x">
                            In the evening, apply a pea-size amount to the face after washing with a general cleanser,
                            followed by a hydrating moisturizer.
                          </li>
                          <li className="mb-2x">
                            To prevent irritation, avoid the eye area (upper and lower eyelids), nasal creases, and
                            corners of mouth.
                          </li>
                        </ul>
                      </div>
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Read more about</h5>
                        <ul className="pl-2x list-style-none modal-list">
                          <li className="mb-2x">
                            <a href="#">
                              <img src={iconChevronRight} alt="Chevron right" className="mr-2x mt-1x" />
                              Lifestyle guidance
                            </a>
                          </li>
                          <li className="mb-2x">
                            <a href="#">
                              <img src={iconChevronRight} alt="Chevron right" className="mr-2x mt-1x" />
                              Making the most out of docent
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="user-plan-item user-plan-item--disabled pl-8x">
            <p className="user-plan-period">July 2021 - October 2021</p>
            <div className="user-plan-detail pb-8x mb-8x">
              <div className="row">
                <div className="col-8-md col-6-sm">
                  <div className="row">
                    <div className="col-6-md">
                      <div className="user-plan-goal mb-8x">
                        <h3 className="mb-4x">Goals</h3>
                        <ol className="pl-6x">
                          <li className="mb-3x">Heal current breakouts and prevent future ones from occuring</li>
                          <li className="mb-3x">Begin to fade dark spots and scarring from past breakouts</li>
                          <li className="mb-3x">Introduce skin to anti-aging properties</li>
                        </ol>
                      </div>
                    </div>
                    <div className="col-6-md">
                      <div className="user-plan-regimen mb-6x pr-8x">
                        <h3 className="mb-4x">Regimen</h3>
                        <div className="regimen-item mb-5x">
                          <h5 className="mb-2x d-flex align-items-center">
                            <img src={iconMorning} className="mr-2x mt-1x icon-morning" />
                            Morning
                          </h5>
                          <ul className="pl-6x">
                            <li className="mb-2x">
                              <a href="#" className="custom-link d-flex align-items-start">
                                <img src={iconFormula} className="mr-2x mt-1x" />
                                Lactic Acid wash
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="regimen-detail">
                          <div className="regimen-item">
                            <h5 className="mb-2x d-flex align-items-center">
                              <img src={iconEvening} className="mr-2x mt-1x icon-evening" />
                              Evening
                            </h5>
                            <ul className="pl-6x">
                              <li className="mb-2x">
                                <a href="#" className="custom-link">
                                  Tretinoin 0.025%, Hydroquinone 4%, Niacinamide 4%
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-12">
                      <img src={plan1} className="mr-2x" alt=""/>
                      <img src={plan2} className="mr-2x" alt=""/>
                      <img src={plan1} className="mr-2x" alt=""/>
                      <img src={plan2} className="mr-2x" alt=""/>
                    </div> */}
                  </div>
                </div>
                <div className="col-4-md col-6-sm">
                  <div className="user-plan-guidance mb-5x pr-8x">
                    <h3 className="mb-4x">Guidance</h3>
                    <div className="user-guidance-detail">
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Adjustment</h5>
                        <ul className="pl-6x">
                          <li className="mb-2x">Week 1 – Use 2 times per week.</li>
                          <li className="mb-2x">Week 2 – Use 3 times per week.</li>
                          <li className="mb-2x">Week 3 – Increase usage to 5 times per week.</li>
                          <li className="mb-2x">Week 4 – Use daily.</li>
                        </ul>
                      </div>
                      <div className="user-guidance-item mb-6x">
                        <h5 className="mb-2x">Application</h5>
                        <ul className="pl-6x">
                          <li className="mb-2x">Step 1: In the evening, wash your face and pat dry.</li>
                          <li className="mb-2x">
                            Step 2: Apply a pea-size amount the face. Avoid the eye area, nasal creases, and corners of
                            mouth.
                          </li>
                          <li className="mb-2x">Step 3: Follow with a moisturizer.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
