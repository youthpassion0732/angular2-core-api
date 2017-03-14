import {updateTsConfig} from '../../utils/project';
import {writeMultipleFiles, appendToFile, createDir} from '../../utils/fs';
import {ng} from '../../utils/process';
import {stripIndents} from 'common-tags';


export default function() {
  return updateTsConfig(json => {
    json['compilerOptions']['baseUrl'] = '.';
    json['compilerOptions']['paths'] = {
      '@shared': [
        'app/shared'
      ],
      '@shared/*': [
        'app/shared/*'
      ]
    };
  })
  .then(() => createDir('src/app/shared'))
  .then(() => writeMultipleFiles({
    'src/app/shared/meaning.ts': 'export var meaning = 42;',
    'src/app/shared/index.ts': `export * from './meaning'`
  }))
  .then(() => appendToFile('src/app/app.component.ts', stripIndents`
    import { meaning } from 'app/shared/meaning';
    import { meaning as meaning2 } from '@shared';
    import { meaning as meaning3 } from '@shared/meaning';

    // need to use imports otherwise they are ignored and
    // no error is outputted, even if baseUrl/paths don't work
    console.log(meaning)
    console.log(meaning2)
    console.log(meaning3)
  `))
  .then(() => ng('build'));
}
