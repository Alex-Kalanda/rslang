import { addElement } from '../../utils/add-element';
import teamInfo from './team-info';

  const raciMatrix = addElement('div', 'raci hidden') as HTMLDivElement;
export const getRaciMatrix = ():HTMLDivElement => {
  raciMatrix.innerHTML = `
  <div class="raci-fields-row">
    <div class="raci-main-title field-border-main">RACI-matrix</div>
    <div class="raci-field raci-developer field-border-main">${teamInfo.sokolov.firstName} ${teamInfo.sokolov.lastName}</div>
    <div class="raci-field raci-developer field-border-main">${teamInfo.kalanda.firstName} ${teamInfo.kalanda.lastName}</div>
    <div class="raci-field raci-developer field-border-main">${teamInfo.grachev.firstName} ${teamInfo.grachev.lastName}</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Application architecture</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">A</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Routing</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">A</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Deploy server</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">I</div>
    <div class="raci-field field-border">I</div>
  </div>
    <div class="raci-fields-row">
    <div class="raci-title">Authorization</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">C</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">API functions</div>
    <div class="raci-field field-border">C</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">A</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Dictionary</div>
    <div class="raci-field field-border">C</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">R</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Game AudioCall</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">A</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Game Sprint</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">A</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Main page</div>
    <div class="raci-field field-border">A</div>
    <div class="raci-field field-border">C</div>
    <div class="raci-field field-border">R</div>
  </div>
  <div class="raci-fields-row">
    <div class="raci-title">Team page</div>
    <div class="raci-field field-border">C</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">A</div>
  </div>
    <div class="raci-fields-row">
    <div class="raci-title">Statistics</div>
    <div class="raci-field field-border">R</div>
    <div class="raci-field field-border">C</div>
    <div class="raci-field field-border">A</div>
  </div>
  <div class="raci-hints">
    <div class="raci-hint"><span class="hint-title">Responsible (R) </span> => { тот кто ответственный за выполнения задачи. }</div>
    <div class="raci-hint"><span class="hint-title">Accountable (A) </span> => { ответственный за проверку результатов или утверждение задачи. }</div>
    <div class="raci-hint"><span class="hint-title">Consulted (C) </span> => { советует, консультирует. }</div>
    <div class="raci-hint"><span class="hint-title">Informed (I) </span> => { оповещается, информируется. }</div>
  </div>
  `;
  return raciMatrix;
}

export const toggleRaci = () => raciMatrix.classList.toggle('hidden');
