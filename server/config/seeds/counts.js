import Cohort from '../../api/cohort/cohort.model';
import User from '../../api/user/user.model';

export function counts() {
  return User.aggregate([
    {
      $group: {
        _id: '$cohort',
        count: {$sum: 1}
      }
    }
  ],
  function (err, result) {
    if (err) {
      console.log(err);
    }
    else {
      let ids = result.map( r => r._id );
      Cohort.find( { _id: { $in: ids } } )
      .then( cohorts => {
        result.forEach( r => {
          let cohort = cohorts.filter( c => c._id.equals(r._id) )[0];
          console.log(`Cohort ${cohort.name} has ${r.count} students.`);
        });
      })
    }
  });
}
