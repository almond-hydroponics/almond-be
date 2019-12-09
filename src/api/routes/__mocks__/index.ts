export const mockedScheduleDataResponse = {
  enabled: true,
  _id: '5dea11bdfe4bb5630557d07b',
  schedule: '2019-07-02T07:54:31.199486+00:00',
  user: '5db36e9e169d644d72e9f27e',
  dateCreated: '2019-12-06T08:30:53.238Z',
  __v: 0
};

export const validScheduleData = {
  schedule: "2019-07-02T07:54:31.199486+00:00",
  enabled: '1'
};

export const mockUser = {
  user: 1
};

const today = new Date();
const exp = new Date(today);
exp.setDate(today.getDate() + 60);

export const mockNewUser = {
  _id: '1234',
  role: 'test',
  name: 'test',
  photo: 'photo.com',
  email: 'test@test.com',
  isVerified: true,
  exp: exp.getTime() / 1000,
  iss: 'http://almond.com',
};


