import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Dialog } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { SegmentedControls } from '../../components/SegmentedControls';
import { UIMessagesObject } from '../../types/ui';
import { translate } from '../../utils/I18n';

export interface SettingsOwnProps {
  locale: UIMessagesObject;
  isSettingsOpen: boolean;
  platform: string;
  close (): void;
  checkForUpdates (): void;
}

export interface SettingsStateProps {
  localeString?: string;
  localeType: 'default' | 'set';
  theme: string;
  isEditingHeroAfterCreationPhaseEnabled: boolean;
  areAnimationsEnabled: boolean;
}

export interface SettingsDispatchProps {
  saveConfig (): void;
  setLocale (id?: string): void;
  setTheme (id: string): void;
  switchEnableEditingHeroAfterCreationPhase (): void;
  switchEnableAnimations (): void;
}

export type SettingsProps = SettingsStateProps & SettingsDispatchProps & SettingsOwnProps;

export function Settings (props: SettingsProps) {
  const {
    close,
    isEditingHeroAfterCreationPhaseEnabled,
    locale,
    localeString,
    localeType,
    setLocale,
    setTheme,
    saveConfig,
    isSettingsOpen,
    theme,
    switchEnableEditingHeroAfterCreationPhase,
    switchEnableAnimations,
    areAnimationsEnabled,
    platform,
    checkForUpdates
  } = props;

  return (
    <Dialog
      id="settings"
      title={translate (locale, 'settings.title')}
      buttons={[{label: translate (locale, 'settings.actions.close'), onClick: saveConfig }]}
      close={close}
      isOpened={isSettingsOpen}
      >
      <Dropdown
        options={[
          {name: translate (locale, 'settings.options.defaultlanguage')},
          {id: 'de-DE', name: 'Deutsch (Deutschland)'},
          {id: 'en-US', name: 'English (United States)'},
          {id: 'nl-BE', name: 'Nederlands (België)'}
        ]}
        value={localeType === 'default' ? undefined : localeString}
        label={translate (locale, 'settings.options.language')}
        onChange={setLocale}
        />
      <p>{translate (locale, 'settings.options.languagehint')}</p>
      <SegmentedControls
        options={[
          {name: translate (locale, 'settings.options.themedark'), value: 'dark'},
          {name: translate (locale, 'settings.options.themelight'), value: 'light'}
        ]}
        active={theme}
        onClick={setTheme}
        label={translate (locale, 'settings.options.theme')}
        />
      <Checkbox
        checked={isEditingHeroAfterCreationPhaseEnabled}
        className="editor-switch"
        label={translate (locale, 'enableeditingheroaftercreationphase')}
        onClick={switchEnableEditingHeroAfterCreationPhase}
        />
      <Checkbox
        checked={areAnimationsEnabled}
        className="animations"
        label={translate (locale, 'settings.options.showanimations')}
        onClick={switchEnableAnimations}
        />
      {(platform === 'win32' || platform === 'darwin') && (
        <BorderButton
          label={translate (locale, 'checkforupdates')}
          onClick={checkForUpdates}
          autoWidth
          />
      )}
    </Dialog>
  );
}
