let github = require('./github-wrapper').github;
let authenticate = require('./github-wrapper').authenticate;

authenticate();

const orgs = [
  'ATL-WDI-Curriculum',
  'ATL-WDI-Exercises',
  'GA-WDI-Lessons',
  'GA-WDI-Exercises',
  'ga-wdi-boston'
];

function printRepoVerbose(repo) {
  console.log(`  repo: ${repo.name}:
    URL: ${repo.html_url}
    Description: ${repo.description}
    created_at: ${repo.created_at}
    updated_at: ${repo.updated_at}
    open_issues_count: ${repo.open_issues_count}
    forks_count: ${repo.open_issues_count}
  `);
};

function splitCommaSepStr(str) {
  let result = str ? str.split(',') : null;
  return result ? result.map( s => s.trim() ) : null;
}

function repoToResourceObject(repo, org) {
  // console.log('repo:', repo);
  let tags = [];
  let info = repo.description;

  if (info && info.length > 0) {
    let index1 = info.indexOf('[');
    let index2 = info.indexOf(']');
    if (index1 !== -1 && index2 > index1) {
      let csv = info.slice(index1+1, index2);
      tags = splitCommaSepStr(csv);
      // console.log(`${repo.name}: ${info} ==> ${tags}`);
    }
  }

  return {
    title: repo.name,
    info: repo.description,
    url:  repo.html_url,
    tags: tags,
    org: org,
    github: {
      id: repo.id,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      open_issues_count: repo.open_issues_count,
      forks_count: repo.forks_count
    }
  };
}

function writeToFile(fileName, data) {
  let fs = require('fs');
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function(err) {
    if (err) { return console.log(err); }
    console.log(`  ${fileName} was saved!`);
  });
}

function makePager() {
  let repos = [];
  return function pager(res) {
    repos = repos.concat(res);
    if (github.hasNextPage(res)) {
      return github.getNextPage(res).then(pager);
    }
    return repos;
  };
}

function exportReposForOrg(org) {
  return github.repos.getForOrg({ org: org })
  .then(makePager())
  .then( repos => {
    console.log(`Org ${org} has ${repos.length} repos.`);
    // console.log('first repo:', repos[0]);
    let reposAsResources = repos.map( repo => { return repoToResourceObject(repo, org); });

    // sort repos by title so that repeated results can be diffed:
    reposAsResources.sort( (a,b) => a.title.localeCompare(b.title) );

    // console.log('reposAsResources:', reposAsResources);
    writeToFile('../../data/' + org.toLowerCase() + '.json', reposAsResources);
  });
}

orgs.forEach( org => exportReposForOrg(org) );
